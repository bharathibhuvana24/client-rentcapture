import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>About Us:  Your Go-To Camera Rental Service</h1>
      <p className='mb-4 text-slate-700'>Welcome to the future of visual storytelling! At [Your Company Name], we believe in empowering creators and enthusiasts with the tools they need to capture moments, tell stories, and bring visions to life without breaking the bank. Established with a passion for photography and videography, our mission is to provide you with high-quality camera equipment that enhances your creativity.</p>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>Who We Are ?</h1>
      <p className='mb-4 text-slate-700'>
      We are a dedicated team of photographers, filmmakers, and tech enthusiasts who understand the nuances of capturing the perfect shot. Our love for visual art drives us to curate a diverse range of equipment, ensuring you have access to the latest and best gear in the industry. From DSLRs to mirrorless cameras, from lenses to lighting kits, our inventory is designed to cater to all your needs.
      </p>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>Our Vision</h1>
      <p className='mb-4 text-slate-700'>Our vision is to democratize access to professional-grade camera equipment. We believe that financial constraints should never limit your creativity. Whether you are an aspiring photographer, a seasoned professional, or just someone who loves to document life's beautiful moments, [Your Company Name] is here to support you every step of the way.</p>
      <Link to= '/Howitworks'><button className='p-3 text-green-700 border border-green-950 rounded uppercase hover:shadow-lg disabled:opacity-80 mx-auto mt-8 flex justify-center'
      > Click here to know How It works</button></Link>
    </div>


  )
}



export default About