import HomeButtonTop from "../components/mini_components/HomeButtonTop";

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl w-full">
        {/* Left Side - Profile */}
        <figure className="p-6">
          <img
            src="./Profile.png" // Replace with your image
            alt="Shubham Awasya"
            className="rounded-xl w-60 h-60 object-cover"
          />
        </figure>

        {/* Right Side - Info */}
        <div className="card-body">
          <h2 className="card-title text-3xl">Shubham Awasya</h2>
          <p className="text-sm text-base-content/70">
            MCA Graduate | Full-Stack Developer
          </p>

          <div className="divider my-2"></div>

          <p>
            Hi! I'm a passionate web developer from{" "}
            <b>Barwani, Madhya Pradesh</b>, currently living in <b>Indore</b>. I
            completed my MCA from
            <b> Shri Vaishnav Vidyapeeth Vishwavidyalaya</b>. I love building
            clean, responsive apps using modern web technologies.
          </p>

          <div className="flex flex-wrap gap-1 m-2">
            <h3 className="font-semibold">Tech Stack:</h3>
            <div className="badge badge-neutral mx-1">React</div>
            <div className="badge badge-neutral mx-1">Tailwind</div>
            <div className="badge badge-neutral mx-1">DaisyUI</div>
            <div className="badge badge-neutral mx-1">Node.js</div>
            <div className="badge badge-neutral mx-1">MongoDB</div>
            <div className="badge badge-neutral mx-1">Express</div>
          </div>

          <div>
            <h3 className="font-semibold mt-4">Hobbies:</h3>
            <ul className="list-disc list-inside text-sm text-base-content/80">
              <li>Chess</li>
              <li>Learning game modding</li>
              <li>Building personal projects</li>
            </ul>
          </div>

          <div className="card-actions justify-start mt-6">
            <a
              href="https://github.com/SubhamAwasya"
              className="btn btn-outline btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shubham-awasya/"
              className="btn btn-outline btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="mailto:iamawasya@gmail.com"
              className="btn btn-outline btn-sm"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <HomeButtonTop />
    </div>
  );
};

export default AboutMe;
