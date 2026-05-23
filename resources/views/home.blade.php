<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Fit-Me | Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Optional: Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            background-color: #f4f6f8;
        }

        header {
            background-color: #1f3c88;
            color: white;
            padding: 1rem 2rem;
        }

        .container {
            padding: 2rem;
        }

        .courses {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .card img {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .card h3 {
            margin: 0 0 0.5rem;
        }

        .btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #ff4d6d;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 0.5rem;
        }

        .btn:hover {
            background-color: #e63956;
        }
    </style>
</head>
<body>

<header>
    <h1>Fit-Me</h1>
</header>

<div class="container">
    <h2>Verfügbare Kurse</h2>

    <div class="courses">
        {{-- Beispiel-Daten (später aus DB ersetzen) --}}
        @for ($i = 1; $i <= 6; $i++)
            <div class="card">
                <img src="https://picsum.photos/536/354" alt="Course Image 1">

                <h3>Kurs {{ $i }}</h3>
                <p>Kurze Beschreibung des Kurses.</p>

                <a href="/courses/{{ $i }}" class="btn">Details</a>
            </div>
        @endfor
    </div>
</div>

</body>
</html>
