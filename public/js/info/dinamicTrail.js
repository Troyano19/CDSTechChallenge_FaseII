import * as trailApi from '../modules/rest-api/trailRestApi.mjs';
import {renderTrails} from '../modules/components/trailsComponents.mjs'
const getTrailData = async () => {
    const pathParts = window.location.pathname.split('/').filter(part => part !== '');
    if (pathParts.length < 3) return;
    const trailID = pathParts[2];
    const req = await trailApi.getTrailById(trailID);
    const res = await req.json();
    console.log(res);
    renderTrails(res);
}





document.addEventListener("DOMContentLoaded", async () => {
    setTimeout(async () => {
        await getTrailData();
    }, 100);
})