



const form = document.getElementById('myForm');
const loading = document.getElementById('loading');

// Your Google Apps Script URL

const scriptURL = 'https://script.google.com/macros/s/AKfycbxwy6uAmJMioe0NIV3lCKOZAuxmdA2QSSR9fOmn7jFtochkt5O6Zeehq_ngUWtne8XN/exec';
form.addEventListener('submit', e => {
  e.preventDefault();

  loading.style.display = 'block';

  // 1. ✅ Get email and store in localStorage
  const email = document.getElementById("email").value;
  localStorage.setItem("clientEmail", email);

  // 2. ✅ Send form to Google Sheet (non-blocking)
  fetch(scriptURL, {
    method: 'POST',
    body: new FormData(form)
  }).then(res => {
    console.log("✅ Form submitted to Google Sheet");
  }).catch(err => {
    console.error("❌ Error submitting form:", err);
  });

  // 3. ✅ Redirect to Razorpay payment page
  window.location.href = './payment.html';
});
