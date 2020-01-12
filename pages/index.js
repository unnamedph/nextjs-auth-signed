import Link from "next/link";
import Layout from "../components/Layout";
import { authInitialProps } from "../lib/auth";

export default function Home(props) {
  return (
    <Layout title="Home" {...props}>
      <Link href="/profile">
        <a>Go to Profile</a>
      </Link>
    </Layout>
  );
}

Home.getInitialProps = authInitialProps();
