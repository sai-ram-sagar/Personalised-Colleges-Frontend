import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";
import optionsData from "../data/options.json";
// import Navbar from "./Navbar"; // Import the Navbar component
import { toast } from "react-toastify"; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamationCircle, faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const Preferences = () => {
  // const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [course, setCourse] = useState(null);
  const [budget, setBudget] = useState(null);
  const [options, setOptions] = useState({ locations: [], courses: [], budgets: [] });
  const [userPreferences, setUserPreferences] = useState([]);

  const fetchPreferences = async (userId) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-preferences/${userId}`);
    const data = await response.json();
    console.log(data)

    if (response.ok) {
      setUserPreferences(data); // Set preferences fetched from the database
    } else {
      // toast.error(data.error || "Error fetching preferences"); // Show error toast
    }
  };

  // Fetch user preferences from the database when the component loads
  useEffect(() => {
    setOptions(optionsData);
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchPreferences(userId);
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User is not logged in!"); // Show error toast
      return;
    }

    const preferences = {
      userId,
      location: location ? location.value : "",
      course: course ? course.value : "",
      budget: budget ? budget.value : ""
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/savePreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      const result = await response.json();
      if (response.ok) {
        // toast.success(result.message); // Show successfully added toast
        fetchPreferences(userId);
        setUserPreferences([...userPreferences, preferences]); // Update local state with new preference
      } else {
        toast.error(result.error || "Error saving preferences"); // Show error toast
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving preferences"); // Show error toast
    }
  };

  const handleDelete = async (preferenceId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        toast.error("User is not logged in!"); // Show error toast
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletePreference`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, preferenceId }),
        });

        const result = await response.json();
        if (response.ok) {
            // toast.success(result.message); // Show successfully deleted toast
            setUserPreferences(userPreferences.filter((pref) => pref.id !== preferenceId)); // Remove deleted preference from state
        } else {
            toast.error(result.error || "Error deleting preference"); // Show error toast
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Error deleting preference"); // Show error toast
    }
};

  return (
    <Container>
      {/* <Navbar onLogout={() => navigate("/")} /> Add Navbar here */}

      <MainContent>
        
        <Form onSubmit={handleSubmit}>
          <h2>Set Your Preferences</h2>
          <FormItems>
            <FormGroup>
              {/* <Label>Location:</Label> */}
              <Select styles={{"cursor": "pointer"}}
                options={options.locations.map((loc) => ({ value: loc, label: loc }))} 
                value={location}
                onChange={setLocation}
                placeholder="Select Location"
              />
            </FormGroup>

            <FormGroup>
              {/* <Label>Course:</Label> */}
              <Select styles={{"cursor": "pointer"}}
                options={options.courses.map((course) => ({ value: course, label: course }))} 
                value={course}
                onChange={setCourse}
                placeholder="Select Course"
              />
            </FormGroup>

            <FormGroup>
              {/* <Label>Budget:</Label> */}
              <Select styles={{"cursor": "pointer"}}
                options={options.budgets.map((budget) => ({ value: budget, label: `₹ ${budget}/-` }))} 
                value={budget}
                onChange={setBudget}
                placeholder="Select Budget"
              />
            </FormGroup>
          </FormItems>

          <SaveButton type="submit">Save Preferences</SaveButton>
        </Form>

        <h2 style={{textAlign:"center", margin:"30px 0px 30px 0px"}}>Your Preferences</h2>
        <PreferencesList>
          {userPreferences.length > 0 ? (
            userPreferences.map((pref) => (
              <PreferenceItem key={pref.id}>
                <DeleteButton onClick={() => handleDelete(pref.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteButton>
                
    {/* Course Title (Bold & Uppercase) */}
                <CourseTitle>{pref.course}</CourseTitle>
                <DetailText>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {pref.location} </p>
                  <p> ₹ {pref.budget.toLocaleString('en-IN')} PA </p>
                </DetailText>
    
              </PreferenceItem>
            ))
          ) : (
            <div style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "8px" }} />
              No preferences set yet.
            </div>

          )}
        </PreferencesList>



      </MainContent>
    </Container>
  );
};


const Container = styled.div`
  font-family: Arial, sans-serif;
  margin-top: 20vh;

  @media screen and (max-width: 500px) {
    margin-top: 15vh;
  }
`;

const MainContent = styled.div`
  padding: 0px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  border-radius: 8px;
  width: 80vw;
  margin: 20px auto;
  padding-bottom: 20px;

  h2 {
    text-align: center;
    font-size: 2rem;
  }

  @media screen and (max-width: 500px) {
   
    height: auto;
    padding: 15px;
    
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const FormItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 50px;

  @media screen and (max-width: 500px) {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 20vw;
  
  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 500px) {
    width: 80vw;
    height: auto;
    margin-bottom: 10px;
  }
`;

const SaveButton = styled.button`
  background-color: #007bff;
  border-radius: 8px;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media screen and (max-width: 500px) {
    width: 80vw;
    padding: 12px;
    font-size: 1rem;
    margin-top: 15px;
  }
`;

const PreferencesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
  gap: 15px;
  max-width: 80vw;
  margin: 20px auto;

  h3{
    text-align: center;
  }
`;

const PreferenceItem = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }
`;

const CourseTitle = styled.p`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 18px;
  margin-bottom: 8px;
  text-align: center;
`;

const DetailText = styled.p`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0px auto;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #ff4d4f;
  transition: transform 0.2s ease-in-out;
  transition: color 0.3s ease-in-out;

  &:hover {
    color:rgb(255, 0, 0);
    transform: scale(1.2);
  }
`;


export default Preferences;
