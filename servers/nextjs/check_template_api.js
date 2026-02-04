
async function check() {
    try {
        const res = await fetch('http://localhost:3000/api/template?group=school_zjut_opening');
        const text = await res.text();
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}
check();
