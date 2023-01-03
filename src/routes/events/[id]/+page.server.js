import { error } from '@sveltejs/kit';
import { exmInstance } from '$lib/exm';
import { functionId } from '$lib/contracts/functionId.js';
import { newEventStore } from '$lib/localStore.js';
import pkg from 'rrule';

const { RRule } = pkg;
let cacheEventValue;


const unsubscribe = newEventStore.subscribe(value => {
    cacheEventValue = value;
});

function getFreq(freq) {
    switch (freq) {
        case 0: return RRule.DAILY;
        case 1: return RRule.WEEKLY;
        case 2: return RRule.MONTHLY;
        default: return null;
    }
}

function getDay(day) {
    switch (day) {
        case 0: return RRule.SU;
        case 1: return RRule.MO;
        case 2: return RRule.TU;
        case 3: return RRule.WE;
        case 4: return RRule.TH;
        case 5: return RRule.FR;
        case 6: return RRule.SA;
        default: return null;
    }
}

function getWeekDays(days, pattern) {
    if (!days || days == [] || pattern === '0') return null;
    return days.map((d) => getDay(Number(d)));
}


/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent }) {
    if (params.id) {
        const { posts } = await parent();
        let data = (posts[params.id]);
        //console.log('parent', data);
        //if (posts[params.id]) { return posts[params.id]; }
        const inputs = [{
            type: 'fetchEvent',
            postId: params.id
        }];
        if (!data) {
            console.warn("need to refetch");
            const res = await exmInstance.functions.write(functionId, inputs, true, false);
            data = await res.data.execution.result;
            //console.log('fetched', data);
        }
        if (!data) {
            data = cacheEventValue[0]['post'];
            //console.log('state', data);
        }
        if (!data) { throw error(404, 'Not found'); }

        const rule = new RRule({
            freq: getFreq(Number(data.freq)),
            dtstart: new Date(data.dtstart),
            tzid: 'Europe/Prague',
            interval: Number(data.interval),
            byweekday: getWeekDays(data.days, Number(data.pattern)),
            bymonthday: data.pattern === '0' ? data.dates.split(',').map((d) => Number(d)) || null : null,
            bysetpos: data.pattern === '1' ? [Number(data.weeknum)] : null
        }, true);

        //console.log(rule);
        //console.log("Rule ", rule.toText());
        let nextevents = [];
        let nextevent = new Date();
        for (let i = 0; i < 5; i++) {
            nextevent = rule.after(nextevent);
            //console.log(i, nextevent);
            nextevents = [...nextevents, nextevent.toJSON()];
        }
        //console.log("data",data)
        //console.log("cache", cacheEventValue[0]['post'])
        //console.log(nextevents);

        return { ...data, nextevents: nextevents.sort() };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const formdata = await request.formData();
        const origdata = formdata.get('postdata');
        const username = formdata.get('username');
        const dates = formdata.getAll('nextEventsChoice');
        const postdata = JSON.parse(origdata);
        const attendance = postdata.attendance || [];
        const addOrReplace = (arr, newObj) => [...arr.filter((o) => o.username !== newObj.username), { ...newObj }];
        const newAttendance = addOrReplace(attendance, { username: username, dates: dates.map((d) => new Date(d).toJSON()) });
        //console.log("newAttServer", newAttendance);

        const inputs = [{
            type: 'updatePost',
            post: {
                id: postdata.id,
                author: postdata.author,
                eventname: postdata.eventname,
                freq: postdata.freq,
                interval: postdata.interval,
                days: postdata.days,
                pattern: postdata.pattern,
                dates: postdata.dates,
                weeknum: postdata.weeknum,
                dtstart: postdata.dtstart,
                description: postdata.description,
                attendance: newAttendance
            }
        }];
        try {
            await exmInstance.functions.write(functionId, inputs);
        }
        catch (err) {
            throw error(500, err);
        }
        return { formdata: JSON.stringify(formdata) };
    }
};