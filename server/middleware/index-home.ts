export default defineEventHandler(async (event) => {
  const urlObj = getRequestURL(event);

  if (urlObj.pathname == "/") {
    await sendRedirect(event, "/home");
  }
});
