import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';
import collegeData from '../data/colleges.json';
// import Navbar from './Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faRefresh, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // Filled heart
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // Outline heart

const RecommendationContainer = styled.div`
  `;

const Container = styled.div`
  max-width: 80vw;
  margin: 20px auto;
  margin-top: 10vh;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 500px) {
    max-width: 90vw;
    margin-top: 10vh;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 2rem;

  @media screen and (max-width: 500px) {
    font-size: 1.5rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @media screen and (max-width: 500px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }
`;

// const Button = styled.button`
//   padding: 10px 20px;
//   background: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
  
//   &:hover {
//     background: #0056b3;
//   }

//   @media screen and (max-width: 500px) {
//     padding: 8px 15px;
//     font-size: 0.9rem;
//   }
// `;

const Select = styled.select`
  align-self: flex-end;
  width: fit-content;
  padding: 10px;
  border-radius: 5px;

  @media screen and (max-width: 500px) {
    align-self: center;
    width: 80%;
    padding: 8px;
  }
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 50px;
  padding: 20px;
  scrollbar-width: none;

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    padding: 10px;
  }
`;

const ListItem = styled.div`
  background: ${(props) => props.bgColor};
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  color: #000;
  scrollbar-width: none;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  @media screen and (max-width: 500px) {
    padding: 10px;
  }
`;


const Badge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 25px;
  width: 25px;
  cursor: pointer;
`;

const ClickHereButton = styled.button`
  align-content: center;
  color: #ff5722;
  position: absolute;
  bottom: 5px;
  right: 10px;
  padding: 8px 9px;
  font-size: 18px;
  border: none;
  background-color: transparent;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  transition: transform 0.2s ease-in-out;
  &:hover {
    color: #e64a19;
    transform: rotate(-10deg);  }
`;

const getRandomColor = () => {
  const colors = [
    "#ffadad", "#ffda77", "#9bf6ff", "#caffbf", "#ffc6ff", "#fdffb6", "#bdb2ff",
    "#fbc3bc", "#ffebb7", "#a0e7e5", "#d4a5a5", "#f4d160", "#b5e2fa", "#d5b9b2", 
    "#a6b1e1", "#eac4d5", "#ffcbf2", "#ffb3c6", "#ffcfdf", "#d4a5ff", "#ffdde1", 
    "#a3c4f3", "#ffc8a2", "#f7aef8", "#b9fbc0", "#d0f4de", "#a2d2ff", "#ffafcc", 
    "#fde4cf", "#c5e1a5", "#ffcb77", "#c9b6e4"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const RecommendationForm = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [bgColors, setBgColors] = useState({});
  const [favoriteColleges, setFavoriteColleges] = useState([]);


  useEffect(() => {
    fetchRecommendations();
    fetchFavorites();
}, []);

const fetchRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-preferences/${userId}`);
        const preferences = response.data;

        if (!preferences || preferences.length === 0) {
            setError("No preferences found.");
            setLoading(false);
            return;
        }

        let filteredColleges = collegeData.filter(college =>
            preferences.some(pref => {
                const locationMatch = college.location?.toLowerCase() === pref.location?.toLowerCase();
                const courseMatch = college.courses?.some(course =>
                    course.toLowerCase() === pref.course.toLowerCase()
                );
                const budgetMatch = pref.budget ? college.fees <= pref.budget : true;

                return locationMatch && courseMatch && budgetMatch;
            })
        );

        if (filteredColleges.length === 0) {
            setError("No matching colleges found.");
        }
         // Generate random colors for each college and store in state
        const colors = {};
        filteredColleges.forEach(college => {
          colors[college.name] = getRandomColor();
        });

        setBgColors(colors);
        setRecommendations(filteredColleges);
        setFilteredRecommendations(filteredColleges);
    } catch (err) {
        setError(err.response?.data?.error || "Error fetching recommendations.");
    } finally {
        setLoading(false);
    }
};

const fetchFavorites = async () => {
    try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/favorites?userId=${userId}`);

        // Map the response correctly to store only college IDs
        setFavoriteColleges(response.data); 
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
};

const toggleFavorite = async (collegeId) => {
    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/toggle`, {
            userId: localStorage.getItem("userId"),
            collegeId
        });

        // Re-fetch favorites to ensure consistency
        fetchFavorites();
    } catch (error) {
        console.error("Error toggling favorite:", error);
    }
};

const sortRecommendations = (option) => {
  let sortedColleges = [...filteredRecommendations];

  switch (option) {
    case 'feeLowToHigh':
      sortedColleges.sort((a, b) => a.fees - b.fees);
      break;
    case 'feeHighToLow':
      sortedColleges.sort((a, b) => b.fees - a.fees);
      break;
    case 'nameAlphabetical':
      sortedColleges.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  setFilteredRecommendations(sortedColleges);
};

const handleClick = (id) => {
  navigate(`/colleges/college?id=${id}`);
};
//   const addToFavorites = async (collegeId) => {
//     try {
//         await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/favorites/add", {
//             userId: localStorage.getItem("userId"), 
//             collegeId
//         });
//         alert("Added to favorites!");
//     } catch (error) {
//         console.error("Error adding favorite:", error);
//         alert("Error adding favorite:", error);
//     }
// };

  return (
    <RecommendationContainer>
      {/* <Navbar onLogout={() => navigate("/")}/> */}
      <Container>
        <Title>Recommended Colleges</Title>
        
        {error && (
          <div style={{ textAlign: "center", fontSize: "18px", color: "red", marginTop: "10px" }}>
            <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "8px" }} />
            {error} <br/>
            <button 
              onClick={() => window.location.href = "/preferences"} 
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                margin:"20px"
              }}
            >
              Go to Preferences
            </button>
          </div>
        )}

        {recommendations.length > 0 && (
          <>
            <ButtonsContainer>
              {/* <Button onClick={fetchRecommendations} disabled={loading}>
                {loading ? 'Loading...' : <FontAwesomeIcon icon={faRefresh} />}
              </Button> */}
              
              {/* Sorting Options */}
              <Select value={sortOption} onChange={(e) => { setSortOption(e.target.value); sortRecommendations(e.target.value); }}>
                <option value="none">None</option>
                <option value="feeLowToHigh">Fee: Low to High</option>
                <option value="feeHighToLow">Fee: High to Low</option>
                <option value="nameAlphabetical">Name: Alphabetical</option>
              </Select>
            </ButtonsContainer>
            {/* College List */}
            <List>
              {filteredRecommendations.map((college) => (
                  <ListItem  key={college.id} bgColor={bgColors[college.name]}>
                      <Badge>
                      <FontAwesomeIcon 
                          icon={favoriteColleges.includes(college.id) ? solidHeart : regularHeart} 
                          onClick={() => toggleFavorite(college.id)}
                          style={{ 
                              cursor: "pointer", 
                              color: favoriteColleges.includes(college.id) ? "red" : "gray",
                              fontSize: "1.5rem"
                          }}
                      />
                      </Badge>
                      <h3>{college.name}</h3>
                      <p>📍 <strong>Location:</strong> {college.location}</p>
                      <p>📚 <strong>Courses:</strong> {college.courses.join(', ')}</p>
                      <p>💰 <strong>Fees:</strong> ₹{college.fees.toLocaleString('en-IN')} per annum</p>
                      <ClickHereButton onClick={() => handleClick(college.id)}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </ClickHereButton>
                  </ListItem>
              ))}
            </List>
          </>
        )}
      </Container>
    </RecommendationContainer>
  );
};

export default RecommendationForm;
