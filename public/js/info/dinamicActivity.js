import * as activityApi from '../modules/rest-api/activityRestApi.mjs';
import {renderActivity} from '../modules/components/activitiesComponents.mjs'
const getActivityData = async () => {
    const pathParts = window.location.pathname.split('/').filter(part => part !== '');
    if (pathParts.length < 3) return;
    const activityId = pathParts[2];
    const req = await activityApi.getActivityById(activityId);
    const res = await req.json();
    console.log(res);
    renderActivity(res);
}





document.addEventListener("DOMContentLoaded", async () => {
    setTimeout(async () => {
        await getActivityData();
    }, 100);
})