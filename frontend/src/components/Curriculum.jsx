import { useState, useEffect } from "react";
import axios from "axios";

const Curriculum = () => {
  const [curriculum, setCurriculum] = useState([]);
  const [newCurriculum, setNewCurriculum] = useState({ title: "", description: "" });

  // Fetch curriculum on mount
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/curriculum");
        setCurriculum(response.data);
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      }
    };

    fetchCurriculum();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewCurriculum({ ...newCurriculum, [e.target.name]: e.target.value });
  };

  // Submit curriculum to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/curriculum",
        newCurriculum
      );
      alert("Curriculum added successfully!");
      setCurriculum([...curriculum, response.data]);
      setNewCurriculum({ title: "", description: "" }); // Reset form
    } catch (error) {
      console.error("Error adding curriculum:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Curriculum</h1>

      {/* Display list */}
      <div className="mb-6">
        {curriculum.length > 0 ? (
          curriculum.map((item, index) => (
            <div key={index} className="p-4 mb-2 border rounded">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>No curriculum found.</p>
        )}
      </div>

      {/* Add curriculum form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Curriculum Title"
          value={newCurriculum.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Curriculum Description"
          value={newCurriculum.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Curriculum
        </button>
      </form>
    </div>
  );
};

export default Curriculum;
