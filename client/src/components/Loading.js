const Loading = ({ center }) => {
  return <div className={center ? 'loading loading-center' : 'loading'}> <p>Loading</p></div>;
};
export default Loading;
