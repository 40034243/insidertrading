const express = require('express');
const request = require('request');

const app = express();

app.get('/', (req, res) => {
  const options = {
    url: `https://query1.finance.yahoo.com/v10/finance/quoteSummary/JNJ?modules=insiderTransactions`,
    headers: {
      'User-Agent': 'My Application'
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      res.send(`An error occurred: ${error}`);
      return;
    }

    if (response.statusCode !== 200) {
      res.send(`Received a ${response.statusCode} status code`);
      return;
    }

    const data = JSON.parse(body);
    let insiderTransactions = data.quoteSummary.result[0].insiderTransactions.transactions;

    if (!Array.isArray(insiderTransactions)) {
      insiderTransactions = [insiderTransactions];
    }

    res.send(`
      <html>
        <head>
          <title>Insider Transactions</title>
        </head>
        <body>
          <h1>Insider Transactions for AAPL</h1>
          <table>
            <thead>
              <tr>
                <th>Filer Name</th>
                <th>Filer Relation</th>
                <th>Transaction Date</th>
                <th>Shares Traded</th>
                <th>Transaction Text</th>
              </tr>
              
            </thead>
        
            <tbody>
              ${insiderTransactions.map(transaction => `
                <tr>
                  <td>${transaction.filerName}</td>
                  <td>${transaction.filerRelation}</td>
                  <td>${transaction.startDate.fmt}</td>
                  <td>${transaction.shares.longFmt}</td>
                  <td>${transaction.transactionText}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  });
});

app.listen(3000, () => {
  console.log('Server listening on 52.41.36.82');
});
