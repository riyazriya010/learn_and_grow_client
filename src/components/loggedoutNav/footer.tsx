// Footer.js
const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-800 py-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
                {/* About Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">About Us</h3>
                    <p className="text-sm leading-relaxed">
                        Learn&Grow is an e-learning platform dedicated to providing high-quality courses for students, mentors, and professionals worldwide.
                        Our mission is to empower learning anytime, anywhere.
                    </p>
                </div>

                {/* Courses Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Courses</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/pages/student/course" className="hover:underline">Browse Courses</a></li>
                        <li><a href="#" className="hover:underline">Popular Courses</a></li>
                        <li><a href="#" className="hover:underline">Mentor-Led Sessions</a></li>
                        <li><a href="#" className="hover:underline">Certification Programs</a></li>
                    </ul>
                </div>

                {/* Resources Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Help Center</a></li>
                        <li><a href="#" className="hover:underline">FAQs</a></li>
                        <li><a href="#" className="hover:underline">Blog</a></li>
                        <li><a href="#" className="hover:underline">Community Forum</a></li>
                    </ul>
                </div>

                {/* Contact Us Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-sm leading-relaxed">
                        Have questions or need support? Get in touch with us:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li>Email: <a href="mailto:info@example.com" className="hover:underline">info@example.com</a></li>
                        <li>Phone: +123 456 7890</li>
                        <li>Address: 123 Learning Lane, Knowledge City</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
                <p>&copy; {new Date().getFullYear()} Learn&Grow. All rights reserved.</p>
            </div>
        </footer>

    );
};

export default Footer;
