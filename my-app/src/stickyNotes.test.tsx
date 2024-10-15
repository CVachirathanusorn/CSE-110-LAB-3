import { render, screen, fireEvent } from "@testing-library/react";
import { StickyNotes } from "./stickyNotes";
import { dummyNotesList } from "./constants"
import userEvent from "@testing-library/user-event";

describe("Create StickyNote", () => {
    test("renders create note form", () => {
        render(<StickyNotes />);

        const createNoteButton = screen.getByText("Create Note");
        expect(createNoteButton).toBeInTheDocument();
    });

    test("creates a new note", () => {
        render(<StickyNotes />);

        // Please make sure your sticky note has a title and content input field with the following placeholders.
        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea =
            screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.change(createNoteTitleInput, { target: { value: "New Note" } });
        fireEvent.change(createNoteContentTextarea, {
            target: { value: "Note content" },
        });
        fireEvent.click(createNoteButton);

        const newNoteTitle = screen.getByText("New Note");
        const newNoteContent = screen.getByText("Note content");

        expect(newNoteTitle).toBeInTheDocument();
        expect(newNoteContent).toBeInTheDocument();
    });
});

describe("test reading sticky note", () => {

    test("all sticky note is loaded", () => {
        render(<StickyNotes />);

        dummyNotesList.forEach(note => {

            const title = screen.getByText(note.title);
            const content = screen.getByText(note.content);

            expect(title).toBeInTheDocument();
            expect(content).toBeInTheDocument();
            expect(title.parentElement).toEqual(content.parentElement);

        });
    });

});

describe("test update sticky note", () => {

    test("sticky note title and content can be updated", async () => {

        render(<StickyNotes />);

        const title = screen.getByText(dummyNotesList[0].title);
        await userEvent.click(title);
        await userEvent.keyboard("abc");

        expect(screen.getByText(dummyNotesList[0].title + ' abc')).toEqual(title);

        const content = screen.getByText(dummyNotesList[0].content);
        await userEvent.click(content);
        await userEvent.keyboard("abc");

        expect(screen.getByText(dummyNotesList[0].content + ' abc')).toEqual(content);

    });

});

describe("test delete sticky note", () => {
    test("delete sticky note", () => {

        render(<StickyNotes />);

        const title = screen.getByText(dummyNotesList[0].title);
        const content = screen.getByText(dummyNotesList[0].content);

        expect(title).toBeInTheDocument();
        expect(content).toBeInTheDocument();

        const xButton = screen.getAllByText('x');
        fireEvent.click(xButton[0]);

        expect(title).not.toBeInTheDocument();
        expect(content).not.toBeInTheDocument();
        
    });
});