const r = /\b(teacher|t\s*\.?\s*r|mr\.?|ms\.?|sir|madam|staff|faculty|prof)\b/;
const tests = ['tr','Tr','tr.','Tr.',' t r ','teacher','Transfer','t.r','tr,','tr:','prof','staff'];
for (let t of tests) {
  console.log(`'${t}' =>`, r.test(t));
}
