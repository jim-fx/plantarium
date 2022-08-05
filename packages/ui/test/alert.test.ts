import { cleanup, render } from '@testing-library/svelte';
import { tick } from "svelte";
/// <reference types="vitest" />

import { afterEach, describe, expect, it } from "vitest";
import { createAlert } from "../src/lib/alert/AlertStore";

import AlertWrapper from '../src/lib/alert/AlertWrapper.svelte';

describe('AlertWrapper.svelte', () => {

  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(AlertWrapper);
    expect(container).toBeTruthy()
  });

  it("Should render with the passed value", async () => {
    const { container } = render(AlertWrapper)
    createAlert("testtest");
    await tick()

    expect(container.innerHTML).toContain("testtest");

  })

});
