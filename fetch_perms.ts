import axios from 'axios';

const fetchPermissions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/permission', {
      headers: {
        'Authorization': 'Bearer '
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
  }
};

fetchPermissions();


 