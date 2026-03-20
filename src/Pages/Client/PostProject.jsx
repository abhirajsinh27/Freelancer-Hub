import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { createProject } from "../../Services/projectService";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";

function PostProject() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput])
      setSkillInput("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (title.length < 5) return alert("Title too short")

    try {
      setLoading(true)

      await createProject({
        title,
        description,
        budget,
        skills,
        deadline,
        clientId: user.uid,
        clientName: user.username, 
      })

      navigate("/client/dashboard")
    } catch (err) {
      alert("Error posting project")
    } finally {
      setLoading(false)
    }
  }

  return (
    
   <div className="min-h-screen bg-linear-to-br from-[#1e1b4b] to-[#0f172a] text-white">

  
  <Header />

 
  <div className="max-w-6xl mx-auto px-6 py-6">
      
      <h1 className="text-3xl font-bold mb-6">Post New Project</h1>

      <div className="grid grid-cols-3 gap-6">

        
        <form
          onSubmit={handleSubmit}
          className="col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-5"
        >

          
          <div>
            <label className="text-sm text-gray-300">Project Title</label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          
          <div>
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* BUDGET + DEADLINE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Budget (₹)</label>
              <input
                className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Deadline</label>
              <input
                type="date"
                className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <label className="text-sm text-gray-300">Skills</label>

            <div className="flex gap-2 mt-1">
              <input
                className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20"
                placeholder="Enter skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />

              <button
                type="button"
                onClick={addSkill}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-xl"
              >
                Add
              </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white/10 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Posting..." : "Post Project"}
          </button>

        </form>

        {/* RIGHT PREVIEW */}
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 h-fit sticky top-6">

          <h2 className="text-lg font-semibold mb-4">Preview</h2>

          <div className="bg-white/10 p-4 rounded-xl">

            <h3 className="font-bold text-lg">
              {title || "Project Title"}
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              {description || "Project description will appear here"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills.length > 0 ? skills.map((s, i) => (
                <span key={i} className="bg-white/20 px-2 py-1 text-xs rounded">
                  {s}
                </span>
              )) : (
                <span className="text-xs text-gray-400">
                  Skills preview
                </span>
              )}
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
              <span className="text-green-400 font-semibold">
                ₹ {budget || 0}
              </span>

              <span className="text-xs text-gray-400">
                {deadline || "No deadline"}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
    </div>
  )
}

export default PostProject
