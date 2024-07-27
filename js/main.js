

document.querySelectorAll(`[aria-labelledby]`).forEach(element => {
    element.style.display = 'none';
});
document.querySelectorAll(".elementor-tab-title").forEach((element) => {
  element.addEventListener("click", function () {
    let __id = element.getAttribute('id')
    var content = document.querySelector(`[aria-labelledby=${__id}]`);
    if (content.style.display === "none") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }

    alert("hit here")
  });
});
