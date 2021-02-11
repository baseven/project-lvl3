export default () => {
  const getGreeting = (name) => `Welcome, ${name}`;
  const greeting = getGreeting('Jon Snow');
  console.log(greeting);
};
