export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
      <p>
        Clean<span className="font-semibold text-green-600">LK</span> ·
        University Mini Hackathon Project &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
