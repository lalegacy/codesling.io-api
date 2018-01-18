export const fetchAllUserTestsHelper = ({ challenge_id }) => {
    return `
      SELECT id, content
      FROM testcases
        WHERE (challenge_id=${challenge_id})
    `;
  };
  