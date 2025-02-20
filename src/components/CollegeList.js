import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import collegeData from "../data/colleges.json";
import optionsData from "../data/options.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faInfoCircle, faChevronLeft, faChevronRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin-top: 10vh;
`;

const Container = styled.div`
  width: 90vw;
  padding: 20px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
`;

const SearchBar = styled.input`
  width: 98%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media screen and (max-width : 500px){
    width: 95%;
  }
`;

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const CarouselContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  gap: 10px;
  white-space: nowrap;
  padding: 0 40px;
`;

const CourseItem = styled.button`
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: none;
  transition: background 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const ArrowButton = styled.button`
  background: rgb(255, 254, 254);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  padding: 5px 10px;
  border-radius: 50%;
  &:hover {
    background: rgb(0, 0, 0);
    color: #ffffff;
  }
`;

const CollegeListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const CollegeCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  transition: transform 0.2s ease-in-out;
  position: relative;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CollegeName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

const CollegeDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  margin: 10px 0;
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

const ViewMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1rem;
  background:rgb(40, 74, 167);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  const courses = optionsData.courses;

  useEffect(() => {
    setColleges(collegeData);
  }, []);

  const filteredColleges = colleges.filter(
    (college) =>
      (college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCourse ? college.courses.includes(selectedCourse) : true)
  );

  const handleScroll = (direction) => {
    setScrollIndex((prev) => Math.max(0, Math.min(prev + direction * 5, courses.length - 5)));
  };

  const handleClick = (id) => {
    navigate(`/colleges/college?id=${id}`);
  };

  return (
    <PageWrapper>
      <Container>
        <Title>All Colleges</Title>
        <SearchBar
          type="text"
          placeholder="Search by name, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CarouselWrapper>
          <ArrowButton style={{ left: "0px" }} onClick={() => handleScroll(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </ArrowButton>
          <CarouselContainer style={{ transform: `translateX(-${scrollIndex * 120}px)` }}>
            {courses.map((course) => (
              <CourseItem key={course} onClick={() => setSelectedCourse(course)}>
                {course}
              </CourseItem>
            ))}
          </CarouselContainer>
          <ArrowButton style={{ right: 0 }} onClick={() => handleScroll(1)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </ArrowButton>
        </CarouselWrapper>
        <CollegeListWrapper>
          {filteredColleges.slice(0, visibleCount).map((college) => (
            <CollegeCard key={college.id}>
              <CollegeName>{college.name.split(",")[0]}</CollegeName>
              <CollegeDetails>
                <p>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: "8px" }} />
                  {college.location}
                </p>
                <p>Fee: ₹ {college.fees.toLocaleString("en-IN")} PA</p>
              </CollegeDetails>
              <p>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: "8px" }} />
                {college.about}
              </p>
              <ClickHereButton onClick={() => handleClick(college.id)}>
                <FontAwesomeIcon icon={faArrowRight} />
              </ClickHereButton>
            </CollegeCard>
          ))}
        </CollegeListWrapper>
        {visibleCount < filteredColleges.length && (
          <ViewMoreButton onClick={() => setVisibleCount((prev) => prev + 6)}>Load More</ViewMoreButton>
        )}
      </Container>
    </PageWrapper>
  );
};

export default CollegeList;
