import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export const parseResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);

        try {
            const data = await pdf(dataBuffer);
            const text = data.text;

            // Simple keyword extraction (can be improved with LLM later if needed)
            // This is a basic list, in a real app this should be more comprehensive or use NLP
            const commonSkills = [
                'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
                'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET',
                'HTML', 'CSS', 'Sass', 'Less', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
                'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Machine Learning', 'AI'
            ];

            const extractedSkills = commonSkills.filter(skill => {
                // Case-insensitive regex match for whole words
                const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                return regex.test(text);
            });

            // Return path and extracted skills
            res.json({
                filePath: req.file.path,
                extractedSkills: [...new Set(extractedSkills)], // Unique skills
                textLength: text.length
            });

        } catch (parseError) {
            console.error('PDF Parse error:', parseError);
            res.status(500).json({ message: 'Error parsing PDF file' });
        }

    } catch (err) {
        console.error('Resume upload error:', err);
        res.status(500).json({ message: 'Server error processing resume' });
    }
};
