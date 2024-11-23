import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import jobsData from './Find Jobs Json/jobsData.json';
import axios from "axios";


const JobDetails = () => {

    const id = useParams().id;
    const job = jobsData.find(job => job.id == id);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplicationSent, setIsApplicationSent] = useState(false);
    const [jobDetail, setJobDetail] = useState(null);
    const [company, setCompany] = useState(null);
    const [formValues, setFormValues] = useState({
        first_name: "",
        email: "",
        phone: "",
        job_title: "",
        linkedin: "",
        cv_file: null, // File will be stored here
    });

    useEffect(() => {
        fetchJobDetails()
    }, []);

    const fetchJobDetails = async () => {
        const response = await axios(`http://127.0.0.1:8000/api/vacancies/${id}`, {
            method: 'GET',
        });

        if (!response.status === 200) {
            console.log('respons', response)
            throw new Error("Failed to fetch jobs");
        }

        const data = await response.data

        setJobDetail(data)

        console.log('data', data)

        fetchCompanyDetails(data?.companyId)
    }

    const fetchCompanyDetails = async (id) => {
        const response = await axios(`http://127.0.0.1:8000/api/companies/${id}`, {
            method: 'GET',
        });

        if (!response.status === 200) {
            console.log('respons', response)
            throw new Error("Failed to fetch company details");
        }

        const data = await response.data

        console.log('data comp', data)


        setCompany(data)
    }

    const handleBackClick = () => {
        navigate('/jobs');
    };

    const handleApplyClick = () => {
        setIsModalOpen(true);
        setIsApplicationSent(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsApplicationSent(false);
        setFormValues({
            first_name: "",
            email: "",
            phone: "",
            job_title: "",
            linkedin: "",
            cv_file: null,
        });
        navigate('/jobs')
    };

    const handleApplicationSent = () => {
        setIsApplicationSent(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormValues((prev) => ({
            ...prev,
            cv_file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("vacancy_id", id);
        formData.append("first_name", formValues.first_name);
        formData.append("email", formValues.email);
        formData.append("phone", formValues.phone);
        formData.append("job_title", formValues.job_title);
        formData.append("linkedin", formValues.linkedin);
        formData.append("cv_file", formValues.cv_file);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/apply",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 201) {
                setIsApplicationSent(true);
            }
        } catch (error) {
            console.error("Failed to submit application", error);
        }
    };

    if (!job) {
        return <div className="no-job-found container">Job not found</div>;
    }

    const jobTypeLabels = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
    };

    const seniorityLevelLabels = {
        'junior': 'Junior',
        'middle': 'Middle',
        'senior': 'Senior',
        'intern': 'Intern',
    };


    return (
        <div className="job-details">
            <div className='back container' onClick={handleBackClick}>
                <img src="/l1.png" alt=""/>
                <span>Back</span>
            </div>
            <div className="job-details-center container">
                <div className="job-details-left">
                    <div className="left-top">
                        <span>Job description</span>
                        <h1>{jobDetail?.title}</h1>
                        <div className="three">
                            {jobDetail?.city && jobDetail?.country && (
                                <div className="date">
                                    <img src="/map-pin-3.png" alt="Location"/>
                                    <span>{jobDetail?.city + ', ' + jobDetail?.country}</span>
                                </div>
                            )}
                            {jobDetail?.jobType && (
                                <div className="date">
                                    <img src="/calendar.png" alt="Job Type"/>
                                    <span>{jobTypeLabels[jobDetail?.jobType]}</span>
                                </div>
                            )}
                            {jobDetail?.seniorityLevel && (
                                <div className="date">
                                    <img src="/reports.png" alt="Experience"/>
                                    <span>{seniorityLevelLabels[jobDetail?.seniorityLevel]}</span>
                                </div>
                            )}
                            {jobDetail?.isRemote && (
                                <div className="date">
                                    <img src="/mouse.png" alt="Remote Status"/>
                                    <span>{'Remote'}</span>
                                </div>
                            )}
                        </div>
                        <div className="buttons">
                            <div className="left-buttons">
                                <button onClick={handleApplyClick}>
                                    <img src="/airplay.png" alt=""/>
                                    <span className='apply'>Apply Job</span>
                                </button>
                                <button>
                                    <img src="/bookmark.png" alt=""/>
                                </button>
                            </div>
                            <div className="right-buttons">
                                <img src="/f.png" alt=""/>
                                <img src="/l1.png" alt=""/>
                                <img src="/t.png" alt=""/>
                                <img src="/end.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="left-bottom">
                        <div className="four">
                            <h5>Overview</h5>
                            <div className="text">
                                {jobDetail?.jobOverview.map((sentence, index) => (
                                    <p key={index}>• {sentence}</p>
                                ))}
                            </div>
                        </div>
                        <div className="four">
                            <h5>The Role:</h5>
                            <div className="text">
                                {jobDetail?.jobRole.map((sentence, index) => (
                                    <p key={index}>• {sentence}</p>
                                ))}
                            </div>
                        </div>
                        <div className="four">
                            <h5>Responsibilities:</h5>
                            <div className="text">
                                {jobDetail?.jobResponsibilities.map((sentence, index) => (
                                    <p key={index}>• {sentence}</p>
                                ))}
                            </div>
                        </div>
                        <div className="four">
                            <h5>You have :</h5>
                            <div className="text">
                                {jobDetail?.youHaveText.map((sentence, index) => (
                                    <p key={index}>• {sentence}</p>
                                ))}
                            </div>
                        </div>
                        <p className='know'>🌈 Mailchimp is 100% in support of diversity and inclusion...</p>
                        <div className="buttons">
                            <div className="left-buttons">
                                <button onClick={handleApplyClick}>
                                    <img src="/airplay.png" alt=""/>
                                    <span>Apply Job</span>
                                </button>
                                <button>
                                    <img src="/bookmark.png" alt=""/>
                                </button>
                            </div>
                            <div className="right-buttons">
                                <img src="/f.png" alt=""/>
                                <img src="/linkedin.png" alt=""/>
                                <img src="/t.png" alt=""/>
                                <img src="/end.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="job-details-right">
                    <img src={`http://127.0.0.1:8000${company?.logo}`} alt="" className={"w-14 h-14 object-cover"}/>
                    <span>Job By</span>
                    <h1>{company?.name} <img src="/logo1.png" alt=""/></h1>
                    <p>{company?.description && company?.description !== "null" ? company?.description : ""}</p>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    {!isApplicationSent ? (
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <form onSubmit={handleSubmit}>
                                <h1>Apply for this position</h1>
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    placeholder="Cameron Williamson"
                                    value={formValues.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="cameronw@gmail.com"
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder="(405) 555-0128"
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="job_title">Job Title</label>
                                <input
                                    type="text"
                                    name="job_title"
                                    id="job_title"
                                    placeholder="Current or previous job title"
                                    value={formValues.job_title}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="linkedin">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    id="linkedin"
                                    placeholder="https://"
                                    value={formValues.linkedin}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="cv_file">CV/Resume</label>
                                <input
                                    type="file"
                                    name="cv_file"
                                    id="cv_file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                />
                                <div className="buttons">
                                    <span onClick={handleCloseModal}>Cancel</span>
                                    <button type="submit">Apply Job</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="modal-content2">
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <img src="/mail-check.png" alt=""/>
                            <h1>Application Sent!</h1>
                            <p>Mailchimp will contact if your skills and experiences are a strong match</p>
                            <button onClick={handleCloseModal}>Browse more similar jobs</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetails;
