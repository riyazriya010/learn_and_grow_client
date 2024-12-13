// Footer.js
const Footer = () => {
    return (
        <footer className="bg-[#433D8B] text-white py-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8 px-4">
                {/* About Section */}
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold mb-2">About</h3>
                    <p className="text-sm">Learn more about our platform and mission.</p>
                </div>

                {/* Social Links Section */}
                <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">Social Links</h3>
                    <div className="flex gap-4 justify-center">
                        <a href="#" className="hover:underline">Facebook</a>
                        <a href="#" className="hover:underline">Twitter</a>
                        <a href="#" className="hover:underline">Instagram</a>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="text-center sm:text-right">
                    <h3 className="text-lg font-bold mb-2">Contact Info</h3>
                    <p className="text-sm">Email: info@example.com</p>
                    <p className="text-sm">Phone: +123 456 7890</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
