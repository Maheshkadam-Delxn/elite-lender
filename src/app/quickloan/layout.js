import Header from "../components/Header";
import Footer from "../components/Footer";

export default function QuickLoanLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}


