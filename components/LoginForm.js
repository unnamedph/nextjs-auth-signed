import Router from "next/router";
import { loginUser } from "../lib/auth";

class LoginForm extends React.Component {
  state = {
    email: "Lucio_Hettinger@annie.ca",
    password: "demarco.info",
    isLoading: false,
    error: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    const { email, password } = this.state;

    event.preventDefault();
    this.setState({ error: "", isLoading: true });
    loginUser({ email, password })
      .then(() => {
        Router.push("/profile");
        this.setState({ isLoading: false });
      })
      .catch(this.setError);
  };

  setError = err => {
    console.error(err);
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, isLoading: false });
  };

  render() {
    const { email, password, error, isLoading } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending" : "Submit"}
        </button>
        {error && <div>{error}</div>}
      </form>
    );
  }
}

export default LoginForm;
