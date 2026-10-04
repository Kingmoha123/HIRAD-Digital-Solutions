import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

export default function MainLayout({ children }) {
  const { dark } = useTheme();

  return (
    <div className={dark ? 'dark' : ''} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
