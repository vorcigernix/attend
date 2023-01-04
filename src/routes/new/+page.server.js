import { exmInstance } from '$lib/exm';
import { functionId } from '$lib/contracts/functionId.js';
import { startOfWeek, addDays, addHours } from 'date-fns';
import { newEventStore } from '$lib/localStore.js';


/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const uuid = crypto.randomUUID();
    const weekstart = addHours(startOfWeek(new Date()), 12);
    const data = await request.formData();
    //console.log(data);

    const inputs = [{
      type: 'createPost',
      post: {
        id: uuid,
        author: data.get('username'),
        eventname: data.get('eventname'),
        oneoff: data.get('oneoffdt') ? new Date(data.get('oneoffdt')).toUTCString() : null,
        freq: data.get('frequency'),
        interval: data.get('interval'),
        days: data.getAll('day'),
        pattern: data.get('pattern'),
        dates: data.get('dates'),
        weeknum: data.get('weeknum'),
        dtstart: new Date().toUTCString(),
        description: data.get('description'),
        attendance: [{ username: data.get('username'), dates: [new Date().toUTCString()] }]
      }
    }];
    console.log(inputs);
    try {
      const res = await exmInstance.functions.write(functionId, inputs);
      console.log(res.status);
      newEventStore.set(inputs);
      return { success: true, url: uuid };
    }
    catch (error) {
      //console.log(error);
      return { success: false };
    }
  }
};