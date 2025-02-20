import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import axios from "axios";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faUniversity,
  faUsers,
  faGlobe,
  faMedal,
  faGraduationCap,
  faMoneyBill,
  faEnvelope,
  faPhone,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import collegeData from "../data/colleges.json";

// Import all 10 images
import clg_bg_img_1 from "../assets/images/clg_bg_img_1.jpg";
import clg_bg_img_2 from "../assets/images/clg_bg_img_2.jpg";
import clg_bg_img_3 from "../assets/images/clg_bg_img_3.jpg";
import clg_bg_img_4 from "../assets/images/clg_bg_img_4.jpg";
import clg_bg_img_5 from "../assets/images/clg_bg_img_5.jpg";
import clg_bg_img_6 from "../assets/images/clg_bg_img_6.jpg";
import clg_bg_img_7 from "../assets/images/clg_bg_img_7.jpg";
import clg_bg_img_8 from "../assets/images/clg_bg_img_8.jpg";
import clg_bg_img_9 from "../assets/images/clg_bg_img_9.jpg";
import clg_bg_img_10 from "../assets/images/clg_bg_img_10.jpg";

// Store images in an array
const collegeImages = [
  clg_bg_img_1, clg_bg_img_2, clg_bg_img_3, clg_bg_img_4, clg_bg_img_5, 
  clg_bg_img_6, clg_bg_img_7, clg_bg_img_8, clg_bg_img_9, clg_bg_img_10
];

const EachCollege = () => {
  const query = new URLSearchParams(useLocation().search);
  const collegeId = query.get("id");
  const college = collegeData.find((c) => c.id.toString() === collegeId);
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");

  const userId = localStorage.getItem("userId")
  const handleSubmit = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/callback-requests`, {
        userId,
        collegeId,
        collegeName: college.name,
        mobileNumber,
        callbackDate,
        callbackTime,
        requestTime: new Date().toISOString(),
      });

      alert("Callback request submitted successfully!");
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request.");
    }
  };

  // Randomly select an image
  const randomImage = collegeImages[Math.floor(Math.random() * collegeImages.length)];

  return (
    <Container background={randomImage}>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </BackButton>
      {college ? (
        <>
          <CollegeCard>
          <Title>{college.name.split(",")[0]}</Title>
          <Location><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Location:</strong> {college.location}</Location>
          <Description>{college.description}</Description>
          <InfoGrid>
            <Info><FontAwesomeIcon icon={faMoneyBill} /> <strong>Fees:</strong> ₹ {college.fees}</Info>
            <Info><FontAwesomeIcon icon={faUniversity} /> <strong>Established:</strong> {college.established}</Info>
            <Info><FontAwesomeIcon icon={faMedal} /> <strong>Ranking:</strong> #{college.ranking}</Info>
            <Info><FontAwesomeIcon icon={faGlobe} /> <strong>Affiliation:</strong> {college.affiliation}</Info>
            <Info><FontAwesomeIcon icon={faUsers} /> <strong>Students :</strong> {college.student_population}</Info>
            <Info><FontAwesomeIcon icon={faGraduationCap} /> <strong>Campus Size:</strong> {college.campus_size} acres</Info>
          </InfoGrid>

          <Courses>
            <h3>Courses Offered:</h3>
            <CoursesGrid>
              {college.courses.map((course, index) => (
                <CourseCard key={index}>{course}</CourseCard>
              ))}
            </CoursesGrid>
          </Courses>

          <NotableAlumni>
            <h3>Notable Alumni:</h3>
            <ul>
              {college.notable_alumni.map((alumnus, index) => (
                <li key={index}>{alumnus}</li>
              ))}
            </ul>
          </NotableAlumni>
          <Contact>
            <ActionButton href={`mailto:${college.email}`}>
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </ActionButton>
            <ActionButton href={`https://${college.website}`} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGlobe} /> Visit Website
            </ActionButton>
            <ActionButton href={`tel:${college.phone}`}>
              <FontAwesomeIcon icon={faPhone} /> Call Now
            </ActionButton>
          </Contact>
        </CollegeCard>

        {/* Callback Popup Button */}
        <PopupButton onClick={() => setModalIsOpen(true)}>
        <FontAwesomeIcon icon={faPhone} /> Request Callback
        </PopupButton>

      {/* Modal */}
        <ModalContainer>
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
            <ModalContent>
              <CloseButton onClick={() => setModalIsOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
              <h2>Request a Callback</h2>
              
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength="10"
              />
              <h3>Choose the best time for the callback: </h3>
              <div style={{display:"flex", justifyContent:"space-between", gap:"20px"}}>
                <Input type="date" value={callbackDate} onChange={(e) => setCallbackDate(e.target.value)} />
                <Input type="time" value={callbackTime} onChange={(e) => setCallbackTime(e.target.value)} />
              </div>
              <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
            </ModalContent>
          </Modal>
        </ModalContainer>
        </>
      ) : (
        <ErrorMessage>College not found!</ErrorMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: url(${(props) => props.background}) no-repeat center center;
  background-size: cover;
  margin-top: 12vh;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  background: #ff5722;
  color: #ffffff;
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);

  &:hover {
    background: #e64a19;
    transform: translateX(-5px);
  }
`;

const CollegeCard = styled.div`
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
  color: black;
`;

const Title = styled.h2`
  font-size: 36px;
  color: black;
  margin-bottom: 10px;
`;

const Location = styled.p`
  font-size: 18px;
  color: black;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Description = styled.p`
  font-size: 16px;
  color:rgba(0, 0, 0, 0.74);
  margin: 20px 0;
  line-height: 1.6;
  text-align: left;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive columns */
  gap: 20px; /* Space between items */
  width: 100%;
  max-width: 800px;
  margin: 20px auto; /* Centering */
`;

const Info = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Light background for contrast */
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px; /* Space between icon and text */
`;


const Courses = styled.div`
  margin-top: 20px;
  text-align: left;

  h3 {
    font-size: 20px;
    color: #2c3e50;
    margin-bottom: 10px;
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Responsive grid */
  gap: 15px;
  margin-top: 10px;
`;

const CourseCard = styled.div`
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #3498db;
    color: white;
    transform: scale(1.05);
  }
`;

const NotableAlumni = styled.div`
  margin-top: 15px;
  text-align: left;
  color: black;
  ul {
    padding-left: 20px;
  }
  li {
    font-size: 16px;
  }
`;

const Contact = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const ActionButton = styled.a`
  padding: 12px 18px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease-in-out;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  box-shadow: 0px 5px 15px rgba(255, 75, 43, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    transform: translateY(-3px);
  }
`;

const ErrorMessage = styled.p`
  font-size: 22px;
  color: #ff4b2b;
  font-weight: bold;
`;

const PopupButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #ff5722;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// const modalStyles = {
//   content: {
//     width: "300px",
//     height: "350px",
//     margin: "auto",
//     padding: "20px",
//     borderRadius: "8px",
//     textAlign: "center",
//   },
// };

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;

  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20vh;
  gap: 10px;
  padding: 20px;

  @media screen and (max-width: 500px) {
    width: 90%;
    margin-top: 10vh;
    padding: 15px;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media screen and (max-width: 500px) {
    width: 100%;
    padding: 8px;
  }
`;

const SubmitButton = styled.button`
  background: rgb(36, 197, 122);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #198754;
    transform: scale(1.05);
  }

  &:active {
    background: rgb(18, 94, 59);
    transform: scale(0.98);
  }

  @media screen and (max-width: 500px) {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 60px;

  &:hover {
    color: red;
  }

  @media screen and (max-width: 500px) {
    font-size: 18px;
    right: 10px;
    top: 60px;
  }
`;

export default EachCollege;
