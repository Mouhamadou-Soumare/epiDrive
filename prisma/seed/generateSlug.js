export function generateSlug(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') 
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, ''); 
}
