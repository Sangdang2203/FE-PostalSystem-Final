export default function splitAddressAndWard(value: string) {
    const parts = value.split(/,\s*Ward:\s*/);
    const address = parts[0].trim();
    const ward = parts[1]?parts[1].trim():null;
    return { address, ward };
}