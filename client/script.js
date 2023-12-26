document.getElementById("ideaForm").addEventListener("submit", async function (event) {
  window.location.reload();
  event.preventDefault(); // Prevents the default form submission
  await createIdea();
});

const createIdea = async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  };

  try {
    const response = await fetch("http://localhost:3000/create", options);
    if (response.ok) {
      const newIdea = await response.json();
      displayNewIdea(newIdea); // Update UI with the new idea
      getData(); // Reload data after adding a new idea
      
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

const displayNewIdea = (idea) => {
  const ideaContainer = document.getElementById("idea-container");

  const ideaCard = document.createElement("div");
  ideaCard.classList.add("idea-card");
  
  const ideaTitle = document.createElement("h3");
  ideaTitle.textContent = idea.title;

  const ideaDescription = document.createElement("p");
  ideaDescription.textContent = idea.description;

  // Append the new idea elements to the existing idea container
  ideaCard.appendChild(ideaTitle);
  ideaCard.appendChild(ideaDescription);
  ideaContainer.appendChild(ideaCard);
};

const deleteIdea = async (ideaId) => {
  try {
    const response = await fetch(`http://localhost:3000/ideas/${ideaId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      // Remove the deleted idea from the UI after successful deletion
      const ideaCard = document.getElementById(`idea-${ideaId}`);
      if (ideaCard) {
        ideaCard.remove();
      }
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting idea:", error);
  }
};

const getData = async () => {
  try {
    const response = await fetch("http://localhost:3000/ideas");
    const data = await response.json();
    console.log(data);
    const ideaContainer = document.querySelector("#idea-container");
    ideaContainer.innerHTML = '';

    data.forEach((element) => {
      const ideaCard = document.createElement("div");
      ideaCard.classList.add("ideaCard");
      ideaCard.id = `idea-${element.id}`; // Unique ID for each idea card
      const ideaTitle = document.createElement("h1");
      ideaTitle.classList.add("ideaTitle");
      ideaTitle.textContent = element.title;
      const ideaDescr = document.createElement("p");
      ideaDescr.textContent = element.description;
      const ideaTime = document.createElement("p");
      ideaTime.textContent = element.created_at;
      const ideaDelete = document.createElement("button");
      ideaDelete.textContent = "Delete";
      ideaDelete.classList.add("delete");
      ideaDelete.addEventListener("click", async () => {
        await deleteIdea(element.id);
      });
      ideaCard.appendChild(ideaTitle);
      ideaCard.appendChild(ideaDescr);
      ideaCard.appendChild(ideaTime);
      ideaCard.appendChild(ideaDelete);
      ideaContainer.appendChild(ideaCard);
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
  }
};

getData();