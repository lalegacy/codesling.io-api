export const addTestCaseHelper = ({ content, challenge_id, output_type }) => {
  return `
    INSERT INTO testCases (content, challenge_id, type)
    VALUES ('${content}', ${challenge_id}, '${output_type}')
  `;
};
