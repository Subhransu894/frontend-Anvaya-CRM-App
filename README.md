# Anvaya CRM APP

A full-stack Client Relation Management (CRM) app where you can browse, search ,edit ,save, add, delete and view detailed lead and agents.
Built with React frontend, Express/Node backend, MongoDB database.

---
## Demo Link 

[Live Demo] ( https://frontend-anvaya-crm-app.vercel.app/ )

---
## Quick Start

```
git clone https://github.com/Subhransu894/frontend-Anvaya-CRM-App.git
cd <your-repo>
npm install
npm run dev
```

---

## Technologies
-React Js
-React Router
-Node Js
-Express
-MongoDB

---

## Demo Video
Watch a walkthrough of all the major features of this app:
[Loom Video] (https://drive.google.com/file/d/1GheS2hSJ12hgByX8HH1eavjXeY7Lw8jO/view?usp=sharing)

---

## Features
**Home**
-Display the first 3 lead list with the satus of lead and a button to add new lead.
-Left side bar contains the browse link for different fields like e-commerce app.

**LeadList**
-Here you can see the list of leads with a button which is used to create new lead.
-In the leaft side bar there is a Back to Home button which takes us back to home page.

**LeadDetails**
-View full information about one particular lead(name,agent name, status,source,priority,tags,time to close).
-Edit button to update name,agent name,source,status,priority,tags,time to close
-Comment section is there to store the coments with name and date.
-Submit button is there to make a comment.

**Agent**
-Display all the agents with a button to add a new agent.
-Left side bar has Back to Home button , which will take to Home.

**Report**
-It has the details of Total Leads closed and in Pipeline,Leads closed by sales agent,Lead Status Distribution.
-All are in graph format.

**Setting**
-Display All leads, All agents in tabular format and table header as name , email and action field.
-Delete button is there in action field which will delete the particular data.

---

## API Reference

### **GET /api/sales-agents** <br>
List all agents <br>
Sample Response: <br>
```
[{_id,name,email},......]
```

### **GET /api/sales-agents/:id** <br>
Get details of one agent<br>
Sample Response: <br>
```
{_id,name,email}
```

### **POST /api/sales-agents** <br>
Create a new agent<br>
Sample Response: <br>
```
{_id,agent name,email}
```

### **DELETE /api/sales-agents/:id** <br>
Delete a agent<br>
Sample Response: <br>
```
{sales agent deleted successfully}
```

### **GET /api/leads** <br>
List all leads<br>
Sample Response: <br>
```
[{_id,name,source,status,salesagent:{_id,name,email},.....}]
```

### **GET /api/leads/:id** <br>
Get details of one lead<br>
Sample Response: <br>
```
{_id,name,source,status,salesagent:{_id,name,email},.....}
```

### **POST /api/leads** <br>
Create a new lead<br>
Sample Response: <br>
```
{_id,name,source,status,salesagent:{_id,name,email},.....}
```

### **POST /api/leads/update/:id** <br>
Update a specific lead<br>
Sample Response: <br>
```
{_id,name,source,status,salesagent:{_id,name,email},.....}
```

### **DELETE /api/leads/:id** <br>
Update a specific lead<br>
Sample Response: <br>
```
{Lead deleted successfully}
```

## Contact

For bugs or featurs request, please reach out to subhransusekhar790@gmail.com