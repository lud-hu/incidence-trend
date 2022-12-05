# Inzidenz Trend

`
Note from 2022 😅:
I started this little project back in the day when there was literally now website showing the trend of the current 7-day-incidence. It was only possible to see the *current* value - which was not that helpful to see whether we are on a good track or not.
`

This is a small web project, that renders a line chart for the historic trend of the 7-day-incidence of the COVID-19 cases in Germany. It's possible to compare graphs from states and districts in different time spans.

Demo:
https://incidence-trend.web.app/

## Technology

The data from the RKI is aggregated in the [API of Marlon Lückert](https://api.corona-zahlen.org/docs/) and rendered in this react app with the [recharts library](https://recharts.org/en-US/).
