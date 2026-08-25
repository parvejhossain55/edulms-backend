const purchaseTemplate = ({ name, title, amount, method, tran_id, date }) => {
  return `  <body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding: 20px;">
                <h1>Congratulations! You Have Successfully Purchased a Course</h1>
                <p>Dear ${name} ,</p>
                <p>We are thrilled to inform you that you have successfully purchased the course, [course title], on our learning management system. Congratulations on taking this important step in advancing your knowledge and skills.</p>
                <p>Here are the details of your order:</p>
                <ul style="list-style-type: none;">
                  <li><strong>Course Title:</strong> ${title}</li>
                  <li><strong>Amount Paid:</strong> ${amount}</li>
                  <li><strong>Payment Method:</strong> ${method}</li>
                  <li><strong>Transaction ID:</strong> ${tran_id}</li>
                  <li><strong>Date of Purchase:</strong> ${date}</li>
                </ul>
                <p>We hope you enjoy your learning experience with us. Please let us know if you have any questions or concerns.</p>
                <p>Thank you for choosing our learning management system!</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`;
};

module.exports = purchaseTemplate;
