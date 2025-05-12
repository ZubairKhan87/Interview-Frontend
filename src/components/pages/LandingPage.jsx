import React, { useState, useEffect } from 'react';
import '../../styles/LandingPage.css';
import interviewerImg from '../../assets/interviewer.png';
import AIInterviewer from '../../assets/AIInterviewer.png';
import logo from '../../assets/logo.png';
import hero from '../../assets/img/hero-img.png';
import "../../assets/vendor/bootstrap-icons/bootstrap-icons.css"; 
//   // import "../../assets/vendor/aos/aos.css"; 
import "../../assets/vendor/glightbox/css/glightbox.min.css"; 
import "../../assets/vendor/swiper/swiper-bundle.min.css"; 
// import "./main.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { motion } from "framer-motion";
import about from '../../assets/img/about.jpg';
import testimonials1 from '../../assets/img/testimonials/testimonials-1.jpg';
import testimonials2 from '../../assets/img/testimonials/testimonials-2.jpg';
import testimonials3 from '../../assets/img/testimonials/testimonials-3.jpg';
import testimonials4 from '../../assets/img/testimonials/testimonials-3.jpg';
import testimonials5 from '../../assets/img/testimonials/testimonials-3.jpg';
import client1 from '../../assets/img/clients/client-1.png';
import client2 from '../../assets/img/clients/client-2.png';
import client3 from '../../assets/img/clients/client-3.png';
import client4 from '../../assets/img/clients/client-4.png';
import client5 from '../../assets/img/clients/client-5.png';
import client6 from '../../assets/img/clients/client-6.png';
import client7 from '../../assets/img/clients/client-7.png';
import client8 from '../../assets/img/clients/client-8.png';
import team1 from '../../assets/img/team/team-1.jpg';
import team2 from '../../assets/img/team/team-2.jpg';
import team3 from '../../assets/img/team/team-3.png';
import team4 from '../../assets/img/team/team-4.jpg';
import { Link } from "react-router-dom";
import Footer from "../layout/Footer"
import { useNavigate } from 'react-router-dom';
import { FaBroadcastTower, FaRegClipboard, FaMicrophoneAlt, FaBrain } from 'react-icons/fa';
import values1 from '../../assets/img/values-1.png';
import values2 from '../../assets/img/values-2.png';
import values3 from '../../assets/img/values-3.png';
const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
   // State for mobile menu
   const [mobileNavActive, setMobileNavActive] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/candidate-login');
  };
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleRecruiterlogin = () => {
    navigate('/recruiter-login');
  };
  const handleCandidatePage = () => {
    navigate('candidate-login/');
  };

    // Toggle mobile navigation
    const toggleMobileNav = () => {
      setMobileNavActive(!mobileNavActive);
    };
  
    // Close mobile nav when clicking on a link or outside
    const closeMobileNav = () => {
      setMobileNavActive(false);
    };
  
    // Close mobile nav when window resizes to larger screen
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 992) {
          setMobileNavActive(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Close mobile nav when clicking outside of it
    useEffect(() => {
      const handleClickOutside = (event) => {
        const header = document.getElementById('header');
        if (mobileNavActive && header && !header.contains(event.target)) {
          setMobileNavActive(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileNavActive]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is the purpose of this AI-Powered Interviewing System?",
      answer:
      "Our system aims to streamline the recruitment process by leveraging AI-based entity classification and confidence prediction. It helps in accurate candidate evaluation, shortlisting, and providing real-time feedback during interviews."
    },
    {
      question:
        "How does the Confidence Prediction feature work?",
      answer:
      "The Confidence Prediction feature assigns a confidence score to the extracted entities from candidates' responses, helping recruiters make more informed decisions based on data accuracy."
    },
    {
      question: "Can this system handle multiple job roles and industries?",
      answer:
      "Yes, the system is designed to handle diverse job roles and industries by customizing the AI model to extract specific entities and skills based on the job requirements."
    },
  ];

  const plans = [
    {
      title: "Free Plan",
      price: "0",
      color: "#20c997",
      icon: "bi-box",
      features: ["Job Posting", "Basic Confidence Prediction", "Limited Interviews"],
      unavailable: ["Real Time Feedback", "No Advanced Features Accessiblity"],
      delay: 100,
      featured: false,
    },
    {
      title: "Starter Plan",
      price: "19",
      color: "#0dcaf0",
      icon: "bi-send",
      features: ["Job Posting","Confidence Prediction", "Automated Shortlisting", "Real-Time Feedback"],
      unavailable: ["No Advanced Features Accessiblity"],
      delay: 200,
      featured: true,
    },
    {
      title: "Business Plan",
      price: "29",
      color: "#fd7e14",
      icon: "bi-airplane",
      features: ["Advanced Analysis", "Confidence Prediction", "Unlimited Interviews", "Detailed Performance Reports", "Real-Time Feedback"],
      unavailable: [],
      delay: 300,
      featured: false,
    },
    {
      title: "Ultimate Plan",
      price: "49",
      color: "#0d6efd",
      icon: "bi-rocket",
      features: ["Advanced Analysis", "Confidence Prediction", "Unlimited Interviews", "Detailed Performance Reports", "Real-Time Feedback"],
      unavailable: [],
      delay: 400,
      featured: false,
    },
  ];

   const testimonials = [
      {
        text: "This system has significantly reduced our hiring time. The technical interview and confidence prediction features help us identify top candidates with ease. The real-time feedback feature is a game-changer.",
        img: testimonials1,
        name: "Saul Goodman",
        role: "Ceo & Founder",
      },
      {
        text: "We were struggling with manual screening, but this AI-powered system made the process seamless. It accurately identifies skills and provides insightful confidence scores, helping us make better decisions.",
        img: testimonials2,
        name: "Sara Wilsson",
        role: "Designer",
      },
      {
        text: "The AI Interviewing System has revolutionized our recruitment process. It not only automates shortlisting but also provides valuable feedback to candidates, enhancing their performance in future interviews",
        img: testimonials3,
        name: "Jena Karlis",
        role: "Store Owner",
      },
      {
        text: "With the help of this system, we have improved our candidate evaluation process. The confidence prediction feature ensures we make data-driven decisions with accuracy.",
        img: testimonials4,
        name: "Matt Brandon",
        role: "Freelancer",
      },
      {
        text: "This AI-based solution has saved us hours of manual effort. The real-time feedback system is excellent for keeping candidates engaged and improving their response.",
        img: testimonials5,
        name: "John Larson",
        role: "Entrepreneur",
      },
    ];
  return (
    <div className="talent-scout-landing-container">
      <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center">
          <img src={logo} alt="" />
          <h1 className="sitename d-none d-sm-block">TalentScout</h1>
        </a>
        
         {/* Navigation menu with mobile active class */}
         <nav id="navmenu" className="navmenu">
            <ul>
              {/* <li><a href="#hero" className="active" onClick={closeMobileNav}>Home</a></li>
              <li><a href="#about" onClick={closeMobileNav}>About</a></li>
              <li><a href="#services" onClick={closeMobileNav}>Services</a></li>
              <li><a href="#portfolio" onClick={closeMobileNav}>Portfolio</a></li>
              <li><a href="#team" onClick={closeMobileNav}>Team</a></li> */}
              {/* <li><a href="#contact" onClick={closeMobileNav}>Contact</a></li>
              <li><Link to="/candidate-login" onClick={closeMobileNav}>Join as Candidate</Link></li>
              <li><Link to="/recruiter-login" onClick={closeMobileNav}>Join as Recruiter</Link></li> */}
              
            </ul>
          </nav>

         {/* Mobile nav toggle button */}
         <div className="d-flex align-items-center">
            <a className="btn-getstarted d-none d-md-inline-block" onClick={handleRecruiterlogin}>
              Join as Recruiter
            </a>
            <a className="btn-getstarted d-none d-md-inline-block" onClick={handleCandidatePage}>
              Join as Candidate
            </a>
            {/* <i 
              className={`mobile-nav-toggle d-lg-none bi ${mobileNavActive ? 'bi-x' : 'bi-list'}`} 
              onClick={toggleMobileNav}
            ></i> */}
          </div>
      </div>
    </header>
          {/* Hero Section */}
    <section id="hero" className="hero section">
    <div className="hero-container">
      <div className="hero-row">
        {/* Text column - always on left */}
        <div className="hero-text-column">
          {/* <h1 data-aos="fade-up"> */}
          <h1 className="main-title">
            
          <span className="gradient-text">
          From Dreams <br />
          To Destinations...<br />
          TalentScout <br />
          Lights the Way.
          <br />
          </span>
            </h1>
          {/* </h1> */}
          <p data-aos="fade-up" data-aos-delay={100}>
          Empowering Recruiters with Smart Hiring <br />
          and Candidates with Bold Opportunities.          </p>
          <div
            className="hero-buttons"
            data-aos="fade-up"
            data-aos-delay={200}
          >
            <a href="candidate-login" className="btn-getstarted d-none d-md-inline-block">
              Get Started <i className="bi bi-arrow-right"></i>
            </a>
            <a
              href="#"
              className="glightbox btn-watch-video"
            >
              <i className="bi bi-play-circle"></i>
              <span>Watch Video</span>
            </a>
          </div>
        </div>
        
        {/* Image column - always on right */}
        <div className="hero-img" data-aos="zoom-out">
          <img src={interviewerImg} className="img-fluid animated" alt="Hero" />
          <img src={AIInterviewer} className="img-fluid animated" alt="Hero" />

        </div>
      </div>
    </div>
  </section>
             {/* About Section */}
  {/* <section id="about" className="about section">
  <div className="about-container"> */}
    {/* <div className="about-row"> */}
      {/* Content column - always on left */}
      {/* <div className="about-text-column">
        <div className="about-content">
          <h3>Who We Are</h3>
          <h2>
            Computer Scientist & AI Enthusiasts 
          </h2>
          <p>
          In our AI-Powered Interviewing System, we aim to revolutionize the recruitment process 
          by integrating advanced natural language processing capabilities. 
          By leveraging candidate technical knowlegde and confidence level we bring perfect one's at the stage.
          This not only streamlines the evaluation process 
          but also ensures unbiased and data-driven decision-making. 
          Our system enhances efficiency, reduces manual effort, and helps 
          recruiters identify the best-fit candidates with greater precision.
          </p>
          <div className="about-read-more">
            <a href="#" className="btn-read-more">
              <span>Read More</span>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div> */}
      
      {/* Image column - always on right */}
      {/* <div className="about-img"> */}
        {/* <img src={hero} className="img-fluid" alt="About Us" />
      </div>
    </div>
  </div>
</section> */}

  {/* Values Section */}
  <section id="values" className="values section">
  <div className="section-title">
    <h2>Our Core Values</h2>
    <p>What Drives TalentScout Forward</p>
  </div>

  <div className="values-cards-container">
    <div className="values-card" data-aos="fade-up" data-aos-delay={100}>
      <div className="card">
        <img src={values1} className="img-fluid" alt="Post Broadcasting" />
        <h3>Job Broadcasting</h3>
        <p>
          Create impactful job posts and reach a wider candidates with ease.
        </p>
      </div>
    </div>

    <div className="values-card" data-aos="fade-up" data-aos-delay={200}>
      <div className="card">
        <img src={values2} className="img-fluid" alt="Vocal Interaction" />
        <h3>Voice-Driven Interviews</h3>
        <p>
          Transform the hiring experience through intelligent voice technology.
        </p>
      </div>
    </div>

    <div className="values-card" data-aos="fade-up" data-aos-delay={300}>
      <div className="card">
        <img src={values3} className="img-fluid" alt="Easy Apply" />
        <h3>Seamless Applications</h3>
        <p>
          Empower candidates to apply quickly with smooth, user-friendly workflows.
        </p>
      </div>
    </div>
  </div>

</section>
<section id="stats" className="stats section">
  <div className="container" data-aos="fade-up" data-aos-delay={100}>
    
    <div className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h2>Our Achievements</h2>
      <p>Numbers that Define TalentScout's Impact</p>
    </div>

    <div className="stats-grid">
      <div className="stats-item">
        <i className="bi bi-emoji-smile color-blue" />
        <div>
          <span data-purecounter-start={0} data-purecounter-end={232} data-purecounter-duration={1} className="purecounter">10</span>
          <p>Successful Placements</p>
        </div>
      </div>

      <div className="stats-item">
        <i className="bi bi-journal-richtext color-orange" />
        <div>
          <span data-purecounter-start={0} data-purecounter-end={521} data-purecounter-duration={1} className="purecounter">12</span>
          <p>Interviews Conducted</p>
        </div>
      </div>

      <div className="stats-item">
        <i className="bi bi-headset color-green" />
        <div>
          <span data-purecounter-start={0} data-purecounter-end={24} data-purecounter-duration={1} className="purecounter">24</span>
          <p>Hours of AI Assistance Daily</p>
        </div>
      </div>

      <div className="stats-item">
        <i className="bi bi-people color-pink" />
        <div>
          <span data-purecounter-start={0} data-purecounter-end={15} data-purecounter-duration={1} className="purecounter">3</span>
          <p>Expert Team Members</p>
        </div>
      </div>
    </div>

  </div>
</section>



<section id="services" className="services section">
  {/* Section Title */}
  <div className="container section-title" data-aos="fade-up">
    <h2>Services</h2>
    <p>Check Our Services</p>
  </div>
  {/* End Section Title */}
  
  <div className="container">
    <div className="services-grid">
      <div className="service-item item-cyan" data-aos="fade-up" data-aos-delay={100}>
        <div className="service-banner">
          <i className="bi bi-activity icon"></i>
        </div>
        <div className="service-content">
          <h3>Job Posting</h3>
          <p>
          Allows recruiters to create and manage job postings to attract suitable candidates.          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
      
      <div className="service-item item-orange" data-aos="fade-up" data-aos-delay={200}>
        <div className="service-banner">
          <i className="bi bi-broadcast icon"></i>
        </div>
        <div className="service-content">
          <h3>Job Application</h3>
          <p>
          Enables candidates to submit applications and provide necessary details for evaluation.
          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
      
      <div className="service-item item-teal" data-aos="fade-up" data-aos-delay={300}>
        <div className="service-banner">
          <i className="bi bi-easel icon"></i>
        </div>
        <div className="service-content">
          <h3>Interview</h3>
          <p>
          Initiates the AI-driven interview process, capturing candidate responses for analysis.          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
      
      <div className="service-item item-red" data-aos="fade-up" data-aos-delay={400}>
        <div className="service-banner">
          <i className="bi bi-bounding-box-circles icon"></i>
        </div>
        <div className="service-content">
          <h3>Confidence Prediction</h3>
          <p>
          Analyzes and assigns confidence scores to the extracted entities for accurate decision-making.
          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
      
      <div className="service-item item-indigo" data-aos="fade-up" data-aos-delay={500}>
        <div className="service-banner">
          <i className="bi bi-calendar4-week icon"></i>
        </div>
        <div className="service-content">
          <h3>Shortlisting Candidate.</h3>
          <p>
          Filters and selects the most suitable candidates based on interview and confidence scores.
          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
      
      <div className="service-item item-pink" data-aos="fade-up" data-aos-delay={600}>
        <div className="service-banner">
          <i className="bi bi-chat-square-text icon"></i>
        </div>
        <div className="service-content">
          <h3>Real-Time Feedback</h3>
          <p>
          Provides instant feedback to candidates during the interview to enhance their performance.          </p>
          {/* <a href="#" className="read-more">
            <span>Read More</span> <i className="bi bi-arrow-right"></i>
          </a> */}
        </div>
      </div>
    </div>
  </div>
</section>

{/* <section id="pricing" className="pricing section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Pricing</h2>
        <p>Check Our Affordable Pricing</p>
      </div>

      <div className="container">
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="pricing-item"
              data-aos="zoom-in"
              data-aos-delay={plan.delay}
            >
              {plan.featured && <span className="featured">Featured</span>}
              <h3 style={{ color: plan.color }}>{plan.title}</h3>
              <div className="price">
                <sup>$</sup>{plan.price}<span> / mo</span>
              </div>
              <div className="icon">
                <i className={`bi ${plan.icon}`} style={{ color: plan.color }} />
              </div>
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
                {plan.unavailable.map((feature, idx) => (
                  <li key={idx} className="na">{feature}</li>
                ))}
              </ul>
              <a href="#" className="btn-buy">
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section> */}


<section id="faq" className="faq section">
  <div className="container mx-auto px-4">
    <div className="text-center" data-aos="fade-up" data-aos-delay="100">
      <h2 className="text-3xl font-bold">F.A.Q</h2>
      <p className="text-gray-500">Frequently Asked Questions</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {faqData.map((faq, index) => (
        <div
          key={index}
          className={`faq-item bg-white shadow-md rounded-lg p-5 transition duration-300 relative ${
            activeIndex === index ? "border-l-4" : ""
          }`}
          onClick={() => toggleFAQ(index)}
          data-aos="fade-up"
          data-aos-delay={`${150 + (index * 50)}`}
          style={{ '--i': index }}
        >
          <h3 className="text-lg font-semibold flex justify-between items-center">
            {faq.question}
            <i
              className={`faq-toggle bi transition-transform duration-300 ${
                activeIndex === index ? "bi-chevron-down rotate-180" : "bi-chevron-right"
              }`}
            />
          </h3>
          {activeIndex === index && (
            <div className="faq-content">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
      <section id="testimonials" className="testimonials section">
              {/* Section Title */}
              <div className="container section-title" data-aos="fade-up">
                <h2>Testimonials</h2>
                <p>
                  What they are saying about us
                  <br />
                </p>
              </div>
              {/* End Section Title */}
              <div className="container">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.3 }}
                    className="testimonial-item"
                  >
                    <div className="stars">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <i key={i} className="bi bi-star-fill" />
                        ))}
                    </div>
                    <p>{testimonial.text}</p>
                    <div className="profile mt-auto">
                      <img
                        src={testimonial.img}
                        className="testimonial-img"
                        alt={testimonial.name}
                      />
                      <h3>{testimonial.name}</h3>
                      <h4>{testimonial.role}</h4>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
            </section>
            {/* /Testimonials Section */}
  

            <section id="clients" className="clients section">
  {/* Section Title */}
  <div className="container section-title" data-aos="fade-up">
    <h2>Our Trusted Partners</h2>
    <p>Collaborating with Leading Industries to Transform Hiring</p>
  </div>
  {/* End Section Title */}
  
  <div className="container" data-aos="fade-up" data-aos-delay={100}>
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        }
      }}
      pagination={{ 
        clickable: true,
        dynamicBullets: true
      }}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      speed={1000}
      className="clients-swiper"
    >
      <SwiperSlide>
        <div className="client-item">
          <img src={client1} className="img-fluid" alt="Client 1" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client2} className="img-fluid" alt="Client 2" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client3} className="img-fluid" alt="Client 3" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client4} className="img-fluid" alt="Client 4" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client5} className="img-fluid" alt="Client 5" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client6} className="img-fluid" alt="Client 6" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client7} className="img-fluid" alt="Client 7" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="client-item">
          <img src={client8} className="img-fluid" alt="Client 8" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</section>


    <section id="contact" className="contact section">
  <div className="container">
    <div className="contact-wrapper">
      {/* Contact Info Cards - Horizontal Layout */}
      <div className="contact-info">
        <div className="info-row">
          <div className="info-card">
            <div className="icon-circle">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div className="info-content">
              <h3>Address</h3>
              <p>Namal Knowlegde City</p>
              <p>Namal University, Mianwali 42220.</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="icon-circle">
              <i className="bi bi-telephone"></i>
            </div>
            <div className="info-content">
              <h3>Call Us</h3>
              <p>+92 307 5270 814</p>
              <p>+92 306 7106 239</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="icon-circle">
              <i className="bi bi-envelope"></i>
            </div>
            <div className="info-content">
              <h3>Email Us</h3>
              <p>zubair2021@namal.edu.pk</p>
              <p>faizan2021@namal.edu.pk</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="icon-circle">
              <i className="bi bi-clock"></i>
            </div>
            <div className="info-content">
              <h3>Open Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00AM - 05:00PM</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simplified Contact Form */}
      {/* <div className="contact-form-container"> */}
        {/* <form action="forms/contact.php" method="post" className="contact-form"> */}
          {/* <div className="form-row">
            <input type="text" name="name" placeholder="Your Name" required="" />
            <input type="email" name="email" placeholder="Your Email" required="" />
          </div>
          <div className="form-row">
            <input type="text" name="subject" placeholder="Subject" required="" />
          </div>
          <div className="form-row">
            <textarea name="message" rows="6" placeholder="Message" required=""></textarea>
          </div>
          <div className="form-row">
            <button type="submit" className="send-btn">Send Message</button>
          </div>
        </form>
      </div> */}
    </div>
  </div>
</section>
      {/* /Contact Section */}
      <footer id="footer" className="footer">
  <div className="container py-4">
    <div className="row">
      <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
        <a href="index.html" className="logo d-flex align-items-center mb-3">
          <span className="sitename">TalentScout</span>
        </a>
        <div className="footer-contact text-center text-md-start">
          <p>Namal Knowledge City</p>
          <p>Namal University, Mianwali 42220</p>
          <p className="mt-2">
            <strong>Phone:</strong> <span>+92 307 5270 814</span>
          </p>
          <p>
            <strong>Email:</strong> <span>zubair2021@namal.edu.com</span>
          </p>
        </div>
      </div>

      <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
        <h4 className="footer-heading">Our Services</h4>
        <ul className="footer-list">
          <li><i className="bi bi-chevron-right"></i> <a >AI-Powered Recruitment</a></li>
          <li><i className="bi bi-chevron-right"></i> <a >Smart Candidate Matching</a></li>
          <li><i className="bi bi-chevron-right"></i> <a >Voice-Activated Interviewing</a></li>
          <li><i className="bi bi-chevron-right"></i> <a>Hiring Analytics and Insights</a></li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
        <h4 className="footer-heading">Follow Us</h4>
        <p>Stay updated on the latest innovations in AI-powered recruitment and hiring solutions.</p>
        <div className="social-links d-flex">
          <a  className="twitter"><i className="bi bi-twitter-x"></i></a>
          <a  className="facebook"><i className="bi bi-facebook"></i></a>
          <a  className="instagram"><i className="bi bi-instagram"></i></a>
          <a  className="linkedin"><i className="bi bi-linkedin"></i></a>
        </div>
      </div>
    </div>
  </div>

  <div className="container copyright text-center py-3">
    <p>
      © <span>Copyright</span> <strong className="px-1 sitename">TalentScout</strong> <span>All Rights Reserved</span>
    </p>
    <div className="credits">
      Designed and Developed by <a href="https://github/ZubairKhan87.com/">Zubair Khan</a> And <a href="https://github/Faizan87.com">Faizan</a>
    </div>
  </div>
</footer>

    

       

      </div>
    
  );
};

export default LandingPage;