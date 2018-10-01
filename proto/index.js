(() => {
  const code = `function add(a, b) {
  return a + b;
}`;

  const result = hljs.highlight('javascript', code, true);
  const cursorHtml = `<span class="code-cursor"></span>`;
  const finalHtml = result.value;

  window.addEventListener('DOMContentLoaded', () => {
    const $back = document.getElementById('back');
    const $display = document.getElementById('display');
    const $input = document.getElementById('input');
    const $error = document.getElementById('error');

    $back.innerHTML = finalHtml;
    $display.innerHTML = cursorHtml;

    $input.addEventListener('input', event => {
      const input = event.target.value;

      if (code.indexOf(input) === -1) {
        const lastIdx = input.length - 1;
        const want = code[lastIdx];
        const got = input[lastIdx];
        $error.innerText = `wrong! want: ${want}, got: ${got}`;
        $input.value = input.substring(0, lastIdx);
        return;
      } else {
        $error.innerText = '';
      }

      const result = hljs.highlight('javascript', input, true);
      $display.innerHTML = result.value + cursorHtml;

      if (input.length === code.length) {
        setTimeout(() => {
          alert(`clear!`);
        });
      }
    });
  });
})();
