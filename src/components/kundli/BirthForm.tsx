import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES, type City } from "@/lib/astro/data";
import type { BirthInput } from "@/lib/astro/kundli";
import { Sparkles, MapPin, User } from "lucide-react";

const EXAMPLES: BirthInput[] = [
  {
    name: "Example — Mahatma Gandhi",
    gender: "Male",
    date: "1869-10-02",
    time: "07:11",
    place: "Porbandar, Gujarat",
    lat: 21.6417,
    lon: 69.6293,
    tz: 5.5,
  },
  {
    name: "Example — Delhi Noon Chart",
    gender: "Female",
    date: "1995-06-21",
    time: "12:00",
    place: "Delhi, Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: 5.5,
  },
];

export function BirthForm({
  onSubmit,
  initial,
  heading = "Enter Birth Details",
}: {
  onSubmit: (input: BirthInput) => void;
  initial?: BirthInput | null;
  heading?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "Male");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [query, setQuery] = useState(initial?.place ?? "");
  const [city, setCity] = useState<City | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [query]);

  const submit = () => {
    if (!date || !time) {
      setError("Please fill birth date and birth time.");
      return;
    }
    const place = city ?? CITIES.find((c) => `${c.name}, ${c.state}` === query) ?? null;
    if (!place) {
      setError("Please pick a birth place from the suggestions.");
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim() || "Native",
      gender,
      date,
      time,
      place: `${place.name}, ${place.state}`,
      lat: place.lat,
      lon: place.lon,
      tz: place.tz,
    });
  };

  return (
    <div className="panel p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-semibold text-primary">{heading}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        जन्म विवरण भरें — accurate time gives an accurate Lagna and Dasha.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Birth date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Birth time (24h)</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="relative space-y-2 sm:col-span-2">
          <Label htmlFor="place" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Birth place
          </Label>
          <Input
            id="place"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setCity(null);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Start typing a city — Varanasi, Mumbai, Kathmandu…"
          />
          {open && matches.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
              {matches.map((c) => (
                <li key={`${c.name}-${c.lon}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-secondary"
                    onClick={() => {
                      setCity(c);
                      setQuery(`${c.name}, ${c.state}`);
                      setOpen(false);
                    }}
                  >
                    <span>
                      {c.name}, {c.state}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}° · UTC{c.tz >= 0 ? "+" : ""}
                      {c.tz}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={submit} size="lg" className="font-semibold">
          <Sparkles className="mr-1.5 h-4 w-4" />
          Generate Kundli
        </Button>
        {EXAMPLES.map((ex) => (
          <Button key={ex.name} variant="outline" size="sm" onClick={() => onSubmit(ex)}>
            {ex.name.replace("Example — ", "Try: ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
