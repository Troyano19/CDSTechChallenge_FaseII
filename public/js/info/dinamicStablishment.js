import * as bussinessApi from '../modules/rest-api/bussinessRestApi.mjs';
import {renderStablishment} from '../modules/components/stablishmentsComponents.mjs'
const getBussinessData = async () => {
    const pathParts = window.location.pathname.split('/').filter(part => part !== '');
    if (pathParts.length < 3) return;
    const businessId = pathParts[2];
    const req = await bussinessApi.getBussinessById(businessId);
    const res = await req.json();
    renderStablishment(res);
}





document.addEventListener("DOMContentLoaded", async () => {
    setTimeout(async () => {
        await getBussinessData();
    }, 100);
})