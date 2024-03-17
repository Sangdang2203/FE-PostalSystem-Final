export default function getWardFromAddress(address: string) {
    const districtIndex = address.toLowerCase().indexOf(", district:");
    if(districtIndex !== -1) {
        return address.slice(districtIndex + 7);
    }
    return null;
}