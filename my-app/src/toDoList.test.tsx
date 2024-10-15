import { render, screen, fireEvent } from "@testing-library/react";
import { ToDoList } from "./toDoList";
import { dummyGroceryList } from "./constants"
import userEvent from "@testing-library/user-event";

describe("Test Rendering", () => {

    test("All items appears", () => {

        render(<ToDoList/>);
        
        dummyGroceryList.forEach(list => {

            const name = screen.getByText(list.name);
            expect(name).toBeInTheDocument();

        });

    });

});

describe("Test Checking", () => {

    test("Number of items reflect clicks", async () => {

        render(<ToDoList/>);
        
        const selects = screen.getAllByRole("checkbox");
        console.log(selects.map(x => x.outerHTML))

        expect(screen.getByText(/Items bought:\s*0/)).toBeInTheDocument();

        await userEvent.click(selects[0])


        expect(screen.getByText(/Items bought:\s*1/)).toBeInTheDocument();

        await userEvent.click(selects[0])


        expect(screen.getByText(/Items bought:\s*2/)).toBeInTheDocument();

        await userEvent.click(selects[0])


        expect(screen.getByText(/Items bought:\s*1/)).toBeInTheDocument();

    });

});