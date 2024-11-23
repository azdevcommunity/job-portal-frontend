import React, {useState, useEffect} from 'react';
import CompaniesData from './Companies.json';
import axios from "axios";

const Browse = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(CompaniesData);
    const [openToRemote, setOpenToRemote] = useState();
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedFunding, setSelectedFunding] = useState('');
    const [industries, setIndustries] = useState([]);
    //
    // useEffect(() => {
    //     applyFilters(CompaniesData);
    // }, [selectedRole, selectedLevel, selectedJobType, searchQuery, locationQuery, selectedFunding]);

    useEffect(() => {
        companies();
    }, [searchQuery, locationQuery, selectedRole, selectedLevel, selectedJobType, selectedFunding]);

    useEffect(() => {
        fetchIndustries()
    }, []);

    const fetchIndustries = async () => {
        try {
            const industriesResponse = await axios.get(`http://127.0.0.1:8000/api/industries`);
            if (industriesResponse.status === 200) {
                const industriesData = industriesResponse.data;

                // Fetch company count for each industry
                const industriesWithCounts = await Promise.all(
                    industriesData.map(async (industry) => {
                        try {
                            const countResponse = await axios.get(`http://127.0.0.1:8000/api/industries/${industry.id}/companies`);
                            return {
                                ...industry,
                                companyCount: countResponse.data.total, // Add total companies to each industry
                            };
                        } catch (error) {
                            console.error(`Error fetching count for industry ${industry.id}:`, error);
                            return {
                                ...industry,
                                companyCount: 0, // Default to 0 if there's an error
                            };
                        }
                    })
                );

                setIndustries(industriesWithCounts);
            }
        } catch (error) {
            console.error('Error fetching industries:', error);
        }
    };

    const companies = async () => {
        const params = {
            name: searchQuery, // Company name
            vacancyName: searchQuery, // Job title
            vacancyCity: locationQuery, // City
            vacancyCountry: locationQuery, // Country
            industryId: selectedRole,
            startupStage: selectedLevel,
            startupSize: selectedJobType,
            openToRemote: openToRemote,
            sortBy: 'desc', // Example sort order
        };

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/companies', {params});

            if (response.status === 200) {
                setFilteredJobs(response.data);
            } else {
                console.error("Failed to fetch companies");
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    // const handleSearch = () => {
    //     const filteredData = CompaniesData.filter(job =>
    //         job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    //         (job.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
    //             locationQuery.toLowerCase().includes(job.location.toLowerCase()))
    //     );
    //
    //     applyFilters(filteredData);
    // };

    const handleSearch = () => {
        // Call the companies function to fetch filtered data
        companies();
    };

    const handleOpenToRemote = (value) => {
        setOpenToRemote(value);
    }

    const keywords = [
        "Advertising",
        "Agriculture",
        "Blockchain",
        "Consumer Goods",
        "Education",
        "Energy & Greentech",
        "Fintech",
        "Food & Beverage",
        "Healthcare"
    ];

    const calculateJobCounts = () => {
        const jobCounts = {};
        keywords.forEach(keyword => {
            jobCounts[keyword] = 0;
        });
        CompaniesData.forEach(job => {
            const title = job.jobTitle.toLowerCase();
            keywords.forEach(keyword => {
                if (title.includes(keyword.toLowerCase())) {
                    jobCounts[keyword]++;
                }
            });
        });

        return jobCounts;
    };

    const handleRoleFilter = (keyword) => {
        setSelectedRole(keyword);
    };

    const handleLevelFilter = (level) => {
        setSelectedLevel(level);
    };

    const handleJobTypeFilter = (jobType) => {
        setSelectedJobType(jobType);
    };

    const handleRemoteFilter = () => {
        setFilteredJobs(prevJobs =>
            prevJobs.filter(job => job.remoteStatus === "Remote OK")
        );
    };

    const handleClearFilters = () => {
        setSelectedRole('');
        setSelectedLevel('');
        setSearchQuery('');
        setLocationQuery('');
        setSelectedJobType('');
        setSelectedFunding('');
        setFilteredJobs(CompaniesData);
    };

    return (
        <div className="back">
            <div className='find-jobs container'>
                <div className="search2">
                    <img src="/search.png" alt=""/>
                    <input type="text" id="search" name="search" placeholder="Company, Job Title..." value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                    <img src="/map-pin-3.png" alt=""/>
                    <input type="text" id="map" name="map" placeholder="City, State, or Country" value={locationQuery}
                           onChange={(e) => setLocationQuery(e.target.value)}/>
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="find-jobs-center">
                    <div className="center-left">
                        <div className="title">
                            <h1>Exciting Companies <span>({filteredJobs.length})</span></h1>
                            <button className='newest'>
                                <img src="/flashlight.png" alt=""/>
                                Newest
                                <img src="/arrow-chevron-down.png" alt=""/>
                            </button>
                        </div>
                        {filteredJobs.length === 0 ? (
                            <p className='error1'>No companies found matching the entered criteria.</p>
                        ) : (
                            <div className="companies1">
                                {filteredJobs.map(job => (
                                    <div className="comp1" key={job.id}>
                                        <div className="top">
                                            <img src={`http://127.0.0.1:8000${job.logo}`} alt={job.name}
                                                 className={"w-14 h-14 object-cover"}/>
                                            <span>{job.name}</span>
                                        </div>
                                        <div className="center">
                                            <span>{job.description}</span>
                                        </div>
                                        <div className="bottom">
                                            <button>{job.jobCount} Jobs Available</button>
                                            <img src="/arrow-right-up.png" alt=""/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="center-right">
                        <div className="center-right-title">
                            <span>Filters</span>
                            <span className='clear' onClick={handleClearFilters}> Clear</span>
                        </div>
                        <div className="filters">
                            <div className="filter1">
                                <div className="title">
                                    <span className='hidden1'>Industry</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                {industries.map((industry) => (
                                    <div className="five uno1" key={industry.id}>
                                        <input
                                            type="radio"
                                            id={industry.id}
                                            name="roles"
                                            onChange={() => handleRoleFilter(industry.id)}
                                            checked={selectedRole === industry.id}
                                        />
                                        <label htmlFor={industry.name}>
                                            {industry.name} <span>({industry.companyCount})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="filter2">
                                <div className="title">
                                    <span>Startup Stage</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Idea" name="StartupStage"
                                           onChange={() => handleLevelFilter("Idea")}
                                           checked={selectedLevel === "Idea"}/>
                                    <label htmlFor="Idea">Idea</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Product-or-prototype" name="StartupStage"
                                           onChange={() => handleLevelFilter("Product-or-prototype")}
                                           checked={selectedLevel === "Product-or-prototype"}/>
                                    <label htmlFor="Product-or-prototype">Product-or-prototype</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Go-to-market" name="StartupStage"
                                           onChange={() => handleLevelFilter("Go-to-market")}
                                           checked={selectedLevel === "Go-to-market"}/>
                                    <label htmlFor="Go-to-market">Go-to-market</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Growth-and-expansion" name="StartupStage"
                                           onChange={() => handleLevelFilter("Growth-and-expansion")}
                                           checked={selectedLevel === "Growth-and-expansion"}/>
                                    <label htmlFor="Growth-and-expansion">Growth-and-expansion</label>
                                </div>
                            </div>
                            <div className="filter3">
                                <div className="title">
                                    <span>Startup Size</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="on" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("1-10")}
                                           checked={selectedJobType === "1-10"}/>
                                    <label htmlFor="on">1-10</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="elli" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("51-100")}
                                           checked={selectedJobType === "51-100"}/>
                                    <label htmlFor="elli">51-100</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="yuz" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("101-200")}
                                           checked={selectedJobType === "101-200"}/>
                                    <label htmlFor="yuz">101-200</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="ikiyuz" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("200+")}
                                           checked={selectedJobType === "200+"}/>
                                    <label htmlFor="ikiyuz">200+</label>
                                </div>
                            </div>
                            <div className="filter4">
                                <div className="title">
                                    <span>Open to remote</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="remote" name="remote" onChange={handleOpenToRemote}/>
                                    <label htmlFor="remote">Open to remote</label>
                                </div>
                            </div>
                            <div className="filter5">
                                <div className="title">
                                    <span>Funding</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Currently" name="funding"
                                           onChange={() => setSelectedFunding('Currently not looking for funding')}
                                           checked={selectedFunding === 'Currently not looking for funding'}/>
                                    <label htmlFor="Currently">Currently not looking for funding</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Looking for funding" name="funding"
                                           onChange={() => setSelectedFunding('Looking for funding')}
                                           checked={selectedFunding === 'Looking for funding'}/>
                                    <label htmlFor="Looking for funding">Looking for funding</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;
