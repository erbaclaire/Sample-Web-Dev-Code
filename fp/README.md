1. There is no need to start a server to use this app. The IEX Group API does not have any CORS rules that prohibit use from a local file. This app also does not use React. Therefore, simply open the html file to begin.

2. I understand that this project does not require the persistence of data for multiple users. Therefore, there is no sign in functionality. 

3. If you try to buy a stock that does not exist, the DOM will not update (the stock will not be purchased) even if there is a price displayed.

4. You can buy more shares of stock you already own by purchasing more from "Buy Stocks". The stock in your portfolio will update to include these new shares.

5. You may be buying the same stock at different times for different prices. If you sell some of this stock, each share's initial value is the total initial value divided by the number of shares. For instance, say you buy one share of stock X for $5/share and then, the next day, buy one share of stock X for $4/share. If you sell one of these shares, the portfolio will say the initial value of that share is ($5+$4)/2 = $4.50. Therefore, the remaining initial value after you sell that share is $4.50. Now, obviously you did not buy either share at $4.50. But since the app does not know if you are selling the share you bought at $5 or the share you bought at $4, it takes the average. This is only important for the net profit. Total Value will work as expected.

6. On mobile, "Initial Value" and "Profit" are removed from the table to make it more viewable. I understand these are not necessary, though, per the requirements, so it should not matter.

7. Prices are rounded to two decimals in the summary table. If you calculate Total Value by doing Shares * Price per Share as Price per Share is presented in the summary table, you may be off by a couple of cents or dollars compared to what is shown since the Total Value, in the table, is calculated by using the non-rounded prices.
