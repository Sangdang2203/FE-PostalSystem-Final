export default function getWardFromAddress(address: string) {
    // const wardIndex = address.toLowerCase().indexOf(", ward:");
    // if(wardIndex !== -1) {
    //     return address.slice(wardIndex + 7);
    // }
    // return null;
    let parts = address.split(/,\s*/);
    let result = parts.slice(-2).join(", ");
    return result;
}