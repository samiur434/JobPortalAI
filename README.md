# 🚀 Job Portal AI

A smart, AI-powered job recruitment platform that intelligently connects candidates with employers using advanced vector similarity search and resume parsing.

## 🌟 Features

### 🧠 AI-Powered Capabilities
- **Similarity Search**: Instantly calculates the match percentage between a candidate's CV and job requirements using Hugging Face embeddings.
- **Smart Job Matching**: Uses vector embeddings to understand the semantic context of job descriptions and resumes, going beyond simple keyword matching.
- **Resume Parsing**: Automatically extracts text from PDF resumes for analysis.

### 💼 For Employers
- **Job Management**: meaningful job postings with detailed requirements.
- **Application Analysis**: View detailed side-by-side comparisons of applicants vs. job descriptions with an AI-generated match score.
- **Dashboard**: Track applications, manage job listings, and review candidates efficiently.

### 👤 For Candidates
- **Easy Application**: Seamlessly apply to jobs with your uploaded CV.
- **Job Discovery**: Find jobs that match your profile and skills.
- **Application Tracking**: Monitor the status of your applications in real-time.

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)

### Backend
- **Node.js & Express**
- **TypeScript**
- **MongoDB** (with Mongoose)
- **Hugging Face Inference API** (sentence-transformers/all-MiniLM-L6-v2)
- **Multer** (File Uploads)
- **PDF-Parse**

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running
- Hugging Face API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/samiur434/JobPortalAI.git
    cd JobPortalAI
    ```

2.  **Backend Setup**
    ```bash
    cd Backend
    npm install
    
    # Create .env file
    # cp .env.example .env (and add your credentials)
    
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📸 Screenshots
*(Add screenshots of your Dashboard and Analysis page here)*

## 📄 License
This project is licensed under the MIT License.
