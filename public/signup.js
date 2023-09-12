let signupform = document.getElementById("signupForm");
signupform.addEventListener("submit", signup);
async function signup(e) {
  e.preventDefault();
  const signupdetails = {
    name: e.target.name.value,
    email: e.target.email.value,
    phoneNumber: e.target.phoneNumber.value,
    password: e.target.password.value,
  };
  try {
    const response = axios.post(
      "http://localhost:3004/user/signup",
      signupdetails
    );
    if (response.status === 201) {
      alert(response.data.message);
      alert("Successfully signed up! Please Login");
    }
  } catch (err) {
    console.log(err.message);
    alert("User already signed up. Please go to the login page.", err.message);
  }
}
