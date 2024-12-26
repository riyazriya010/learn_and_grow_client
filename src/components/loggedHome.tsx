"use client"
import Image from "next/image"
import Footer from "./loggedoutNav/footer"
import faqData from "@/data"
import { useState } from "react"
import LoggedInHeader from "./loggedInNav/header"


const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-t-2 pt-4">
            {/* Question and Toggle Button */}
            <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{question}</p>
                <button
                    className="text-[#433D8B] text-2xl font-bold focus:outline-none"
                    onClick={toggleOpen}
                >
                    {isOpen ? "x" : "+"}
                </button>
            </div>

            {/* Answer (visible only when isOpen is true) */}
            {isOpen && (
                <p className="text-sm mt-4 text-gray-600">{answer}</p>
            )}
        </div>
    );
};


const LoggedInHome = () => {

    return (
        <>
            

            <div className="flex flex-col min-h-screen bg-white">
                
                <LoggedInHeader />
                

                {/* First Layer */}
                <section className="flex justify-between items-center px-8 py-16">
                    <div className="w-1/2">
                        <Image
                            src="/images/home-image-1.webp"
                            alt="Student studying"
                            width={500}
                            height={300}
                            className="w-full h-auto object-cover rounded-lg"
                        />

                    </div>
                    <div className="w-1/2 text-black">
                        <h2 className="text-4xl font-normal">Improve Your</h2>
                        <h3 className="text-4xl font-normal mt-2">Online Learning Experience Better</h3>

                        <button
                            className="mt-6 px-9 py-3 bg-[#433D8B] text-white rounded-[19px] text-lg font-medium shadow-lg hover:bg-[#322D6B] transition-all"
                        >
                            Subscription
                        </button>

                    </div>
                </section>

                {/* Second Layer */}
                <section className="text-center py-16">
                    <h2 className="text-4xl font-normal">
                        Expand Your <span className="text-[#433D8B]">Career Opportunity</span> <br /> With Our Courses
                    </h2>

                    <div className="flex justify-center mt-8 overflow-x-auto gap-8"> {/* Increased gap for more space between cards */}
                        {/* First Card */}
                        <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg w-[300px] h-[auto] p-4 text-center flex flex-col">
                            {/* Image */}
                            <Image
                                src="/images/web-development.jpg"
                                alt="courses"
                                width={300} // Adjusted width for the image to fit the card
                                height={160} // Adjusted height for the image
                                className="w-full h-auto object-cover rounded-lg mb-4"
                            />
                            {/* Card content */}
                            <div className="flex flex-col justify-between h-full space-y-4">
                                <div className="flex flex-col justify-start space-y-2">
                                    {/* Course Title */}
                                    <h4 className="font-semibold text-left">MERN Stack Web Developer Course</h4>
                                    {/* Series Description */}
                                    <p className="text-sm text-left">Series Using Typescript</p>
                                    {/* Rating */}
                                    <div className="flex justify-start items-center mt-2">
                                        <span className="text-yellow-400">★★★★☆</span>
                                    </div>
                                </div>
                                {/* Price and Student Count - Positioned opposite */}
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-left text-lg">₹ 450.45</p>
                                    <p className="text-right text-sm text-gray-500">30 students</p>
                                </div>
                            </div>
                        </div>

                        {/* Second Card */}
                        <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg w-[300px] h-[auto] p-4 text-center flex flex-col">
                            {/* Image */}
                            <Image
                                src="/images/web-development.jpg"
                                alt="courses"
                                width={300} // Adjusted width for the image to fit the card
                                height={160} // Adjusted height for the image
                                className="w-full h-auto object-cover rounded-lg mb-4"
                            />
                            {/* Card content */}
                            <div className="flex flex-col justify-between h-full space-y-4">
                                <div className="flex flex-col justify-start space-y-2">
                                    {/* Course Title */}
                                    <h4 className="font-semibold text-left">MERN Stack Web Developer Course</h4>
                                    {/* Series Description */}
                                    <p className="text-sm text-left">Series Using Typescript</p>
                                    {/* Rating */}
                                    <div className="flex justify-start items-center mt-2">
                                        <span className="text-yellow-400">★★★★☆</span>
                                    </div>
                                </div>
                                {/* Price and Student Count - Positioned opposite */}
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-left text-lg">₹ 450.45</p>
                                    <p className="text-right text-sm text-gray-500">30 students</p>
                                </div>
                            </div>
                        </div>

                        {/* Third Card */}
                        <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg w-[300px] h-[auto] p-4 text-center flex flex-col">
                            {/* Image */}
                            <Image
                                src="/images/web-development.jpg"
                                alt="courses"
                                width={300} // Adjusted width for the image to fit the card
                                height={160} // Adjusted height for the image
                                className="w-full h-auto object-cover rounded-lg mb-4"
                            />
                            {/* Card content */}
                            <div className="flex flex-col justify-between h-full space-y-4">
                                <div className="flex flex-col justify-start space-y-2">
                                    {/* Course Title */}
                                    <h4 className="font-semibold text-left">MERN Stack Web Developer Course</h4>
                                    {/* Series Description */}
                                    <p className="text-sm text-left">Series Using Typescript</p>
                                    {/* Rating */}
                                    <div className="flex justify-start items-center mt-2">
                                        <span className="text-yellow-400">★★★★☆</span>
                                    </div>
                                </div>
                                {/* Price and Student Count - Positioned opposite */}
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-left text-lg">₹ 450.45</p>
                                    <p className="text-right text-sm text-gray-500">30 students</p>
                                </div>
                            </div>
                        </div>

                        {/* Add more cards as needed */}
                    </div>
                </section>



                {/* Third Layer */}
                <section className="flex justify-between items-center px-8 py-16">
                    <div className="w-1/2">
                        <h2 className="text-4xl font-normal text-black">Unlock Your Potential</h2>
                        <p className="text-3xl mt-2">With the <span className="text-[#433D8B]">Right Mentor</span></p>
                    </div>
                    <div className="w-1/2">
                        <Image
                            src="/images/home-mentor.jpg"
                            alt="Student studying"
                            width={500}
                            height={300}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </section>

                {/* Fourth Layer (FAQ Section) */}
                <section className="py-16 text-center">
                    <h2 className="text-4xl font-normal text-black">Frequently Asked Questions</h2>

                    {/* Add container for padding */}
                    <div className="mt-8 space-y-4 px-8 md:px-16 lg:px-32">
                        {faqData.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </div>
                </section>


            </div>

            <Footer />
        </>
    )
}
export default LoggedInHome