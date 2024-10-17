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

    test("creates a new note validation error (title length > 50)", () => {
        render(<StickyNotes />);
        
        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea = screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        jest.spyOn(window, 'alert').mockImplementation(() => {});

        fireEvent.change(createNoteTitleInput, { target: { value: "A".repeat(51) } });
        fireEvent.change(createNoteContentTextarea, { target: { value: "Valid content" } });
        fireEvent.click(createNoteButton);

        expect(window.alert).toBeCalledWith("Title cannot exceed 50 characters.");
    });

    test("creates a new empty note", () => {
        render(<StickyNotes />);
        
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.click(createNoteButton);

        const xButton = screen.getAllByText('x');
        expect(xButton.length).toEqual(7);
    });

    test("creates duplicates note", () => {
        render(<StickyNotes />);

        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea =
            screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.change(createNoteTitleInput, { target: { value: "New Note" } });
        fireEvent.change(createNoteContentTextarea, {
            target: { value: "Note content" },
        });
        fireEvent.click(createNoteButton);
        fireEvent.click(createNoteButton);

        const newNoteTitle = screen.getAllByText("New Note");
        const newNoteContent = screen.getAllByText("Note content");

        expect(newNoteTitle.length).toEqual(1);
        expect(newNoteContent.length).toEqual(1);
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

    test("label is rendered correctly", () => {
        render(<StickyNotes />);

        dummyNotesList.forEach(note => {

            const title = screen.getByText(note.title);
            const label = title.parentElement?.querySelectorAll("p") || []

            expect(title).toBeInTheDocument();
            expect(Array.from(label).map(x => x.innerHTML.replace(" ", "").replace(" ", ""))).toContain(note.label);

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